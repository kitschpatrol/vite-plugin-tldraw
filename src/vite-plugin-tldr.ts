import { type TldrawToImageOptions, tldrawToImage } from '@kitschpatrol/tldraw-cli'
import slugify from '@sindresorhus/slugify'
import { nanoid } from 'nanoid'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { isFile } from 'path-type'
import { type Plugin, normalizePath } from 'vite'

// Returns a URL to an svg generated from the tldr file
// Pass any values from TldrawToImageOptions as params in the URL
// TODO get options from props?

export type TldrPluginOptions = {
	cacheEnabled: boolean
	defaultImageOptions?: TldrImageOptions
	verbose: boolean
}

export type TldrImageOptions = Pick<
	TldrawToImageOptions,
	'darkMode' | 'format' | 'stripStyle' | 'transparent'
>

export default function tldrPlugin(options: TldrPluginOptions): Plugin {
	const defaultOptions: TldrPluginOptions = {
		cacheEnabled: true,
		defaultImageOptions: {
			darkMode: false,
			format: 'svg',
			stripStyle: false,
			transparent: false,
		},
		verbose: false,
	}

	const resolvedOptions: TldrPluginOptions = {
		...defaultOptions,
		...options,
	}

	let cacheDirectory = ''
	let outputPath = ''
	let isBuild = false

	return {
		configResolved(config) {
			cacheDirectory = path.join(config.cacheDir, 'tldr')
			outputPath = config.build.assetsDir
			isBuild = config.command === 'build'
		},
		name: 'vite:tldr',

		async transform(_, id) {
			// Strip parameters before testing for match
			const cleanId = id.replace(/\?.*$/, '')
			if (cleanId.endsWith('.tldr')) {
				// Extract params
				// remove the tldr tag from the end
				const paramsString = id.replace(/&tldr.*$/, '').split('?')[1] ?? ''
				const params = new URLSearchParams(paramsString)
				const imageOptions = convertSearchParamsToObject<TldrImageOptions>(params)

				// Merge options, with the following priority:
				// 1. URL search params provided in the module import url
				// 2. TldrImageOptions passed in plugin options
				// 3. Defaults defined for plugin, matching the defaults in tldraw-cli
				const mergedImageOptions: TldrImageOptions & {
					// Tldraw-cli supports arrays of frame names, but to maintain 1:1 relationship
					// between input and output files, we only support a single frame name here
					frame?: string
				} = {
					...resolvedOptions.defaultImageOptions,
					...imageOptions,
				}

				// Sort out filenames
				const sourcePath = normalizePath(cleanId)
				const sourcePathRelative = path.relative(
					process.cwd(), // TODO - is this the right path?
					sourcePath,
				)
				const sourceHash = await getFileHash(sourcePath, mergedImageOptions)
				const sourceFilename = path.basename(sourcePath, path.extname(sourcePath))

				const frameName = mergedImageOptions.frame ? slugify(mergedImageOptions.frame) : undefined

				const sourceCacheFilename = `${[sourceFilename, frameName, sourceHash]
					.filter((element) => element !== undefined)
					.join('-')}.${mergedImageOptions.format}`
				const sourceCachePath = path.join(cacheDirectory, sourceCacheFilename)
				const sourceCachePathRelative = path.relative(
					process.cwd(), // TODO - is this the right path?
					sourceCachePath,
				)

				if (!resolvedOptions.cacheEnabled) {
					await fs.rmdir(cacheDirectory, { recursive: true })
				}

				// Check for cache, generate svg from tldr if needed
				const cacheIsValid = await isFile(sourceCachePath)
				if (!cacheIsValid) {
					if (resolvedOptions.verbose) {
						console.log(
							`\n[vite-tldr-plugin] Generating image:\n  From:\t"${sourcePathRelative}"\n  To:\t"${sourceCachePathRelative}"`,
						)
					}

					const startTime = performance.now()
					await fs.mkdir(cacheDirectory, { recursive: true })

					// TODO a bit of a type mess from the frame transformations
					const tldrawResponse = (await tldrawToImage(sourcePath, {
						darkMode: mergedImageOptions.darkMode,
						format: mergedImageOptions.format,
						frames: (typeof mergedImageOptions.frame === 'string'
							? [mergedImageOptions.frame]
							: false) as false & string[],
						name: nanoid(), // Unique temp name to avoid collisions
						output: cacheDirectory,
						stripStyle: mergedImageOptions.stripStyle,
						transparent: mergedImageOptions.transparent,
					})) as string | string[]

					// TldrawToImage returns an array of output files when frames is set,
					// extract the first one
					const outputFile = Array.isArray(tldrawResponse) ? tldrawResponse[0] : tldrawResponse

					await fs.rename(outputFile, sourceCachePath)

					if (resolvedOptions.verbose) {
						console.log(
							`\n[vite-tldr-plugin] Finished generating image:\n  From:\t"${sourcePathRelative}"\n  To:\t"${sourceCachePathRelative}"\n  Time:\t${(
								(performance.now() - startTime) /
								1000
							).toFixed(2)} seconds`,
						)
					}
				}

				if (isBuild) {
					// Copy to output dir if building
					const outputFilePath = path.join(outputPath, sourceCacheFilename)
					this.emitFile({
						fileName: outputFilePath,
						source: await fs.readFile(sourceCachePath),
						type: 'asset',
					})

					return {
						code: `export default "${path.join('/', outputFilePath)}";`,
					}
				}

				// Serve from cache if dev
				return {
					code: `export default "${sourceCachePathRelative}";`,
				}
			}
		},
	}
}

// Helpers

async function getFileHash(filePath: string, tldrawOptions?: TldrImageOptions): Promise<string> {
	const fileBuffer = await fs.readFile(filePath)
	const hash = crypto.createHash('sha1')
	hash.update(fileBuffer)

	// Include options in the hash
	if (tldrawOptions) {
		hash.update(JSON.stringify(tldrawOptions))
	}

	return hash.digest('hex').slice(0, 8)
}

function convertSearchParamsToObject<T>(params: URLSearchParams): T {
	const object: Record<string, unknown> = {}
	for (const [key, value] of params.entries()) {
		object[key] = value
	}

	return object as T
}
