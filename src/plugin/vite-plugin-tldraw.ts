import {
	type TldrawToImageOptions as TldrawCliImageOptions,
	tldrawToImage,
} from '@kitschpatrol/tldraw-cli'
import slugify from '@sindresorhus/slugify'
import { nanoid } from 'nanoid'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { isFile } from 'path-type'
import prettyBytes from 'pretty-bytes'
import prettyMilliseconds from 'pretty-ms'
import { type Plugin, normalizePath } from 'vite'

// Returns a URL to an svg generated from the tldr file
// Pass any values from TldrawImageOptions as params in the URL

export type TldrawPluginOptions = {
	cacheEnabled?: boolean
	defaultImageOptions?: TldrawImageOptions
	verbose?: boolean
}

export type TldrawImageOptions = Pick<
	TldrawCliImageOptions,
	'dark' | 'format' | 'padding' | 'scale' | 'stripStyle' | 'transparent'
>

export default function tldraw(options?: TldrawPluginOptions): Plugin {
	// Merge user options with defaults
	const resolvedOptions: Required<TldrawPluginOptions> & {
		defaultImageOptions: TldrawImageOptions
	} = {
		cacheEnabled: true,
		defaultImageOptions: {
			dark: false,
			format: 'svg',
			stripStyle: false,
			transparent: false,
		},
		verbose: false,
		...stripUndefined(options),
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
		name: 'vite-plugin-tldraw',
		async transform(_, id) {
			// Strip parameters before testing for match
			const cleanId = id.replace(/\?.*$/, '')
			if (cleanId.endsWith('.tldr')) {
				// Extract params
				// remove the tldr tag from the end
				const paramsString = id.replace(/&tldr.*$/, '').split('?')[1] ?? ''
				const params = new URLSearchParams(paramsString)
				const imageOptions = convertSearchParamsToObject<TldrawImageOptions>(params)

				// Merge options, with the following priority:
				// 1. URL search params provided in the module import url
				// 2. TldrawImageOptions passed in plugin options
				// 3. Defaults defined for plugin, matching the defaults in tldraw-cli
				const mergedImageOptions: TldrawImageOptions & {
					// Tldraw-cli supports arrays of frame names, but to maintain 1:1 relationship
					// between input and output files, we only support a single frame name here
					frame?: string
				} = {
					...resolvedOptions.defaultImageOptions,
					...stripUndefined(imageOptions),
				}

				// Sort out filenames
				const sourcePath = normalizePath(cleanId)
				const sourcePathRelative = path.relative(
					process.cwd(), // TODO - is this the right path?
					sourcePath,
				)
				const sourceHash = await getFileHash(sourcePath, mergedImageOptions)
				const sourceFilename = path.basename(sourcePath, path.extname(sourcePath))

				// Sort out options
				const { cacheEnabled, verbose } = resolvedOptions
				const { dark, format, frame, padding, scale, stripStyle, transparent } = mergedImageOptions
				const frameName = frame ? slugify(frame) : undefined

				const sourceCacheFilename = `${[sourceFilename, frameName, sourceHash]
					.filter((element) => element !== undefined)
					.join('-')}.${format}`
				const sourceCachePath = path.join(cacheDirectory, sourceCacheFilename)
				const sourceCachePathRelative = path.relative(
					process.cwd(), // TODO - is this the right path?
					sourceCachePath,
				)

				if (!cacheEnabled) {
					await fs.rm(cacheDirectory, { recursive: true })
				}

				// Check for cache, generate svg from tldr if needed
				const cacheIsValid = await isFile(sourceCachePath)

				if (cacheIsValid) {
					if (verbose) {
						console.log(
							`\n[vite-tldr-plugin] Cache found:\n  For:\t"${sourcePathRelative}"\n  At:\t"${sourceCachePathRelative}"`,
						)
					}
				} else {
					const startTime = performance.now()
					await fs.mkdir(cacheDirectory, { recursive: true })

					if (verbose && cacheEnabled) {
						console.log(
							`\n[vite-tldr-plugin] Cache missed:\n  For:\t"${sourcePathRelative}"\n  At:\t"${sourceCachePathRelative}"`,
						)
					}

					// TldrawToImage returns an array of output files when frames is set, we always take the first one
					const [outputFile] = await tldrawToImage(sourcePath, {
						dark,
						format,
						frames: frame ? [frame] : false,
						name: nanoid(), // Unique temp name to avoid collisions
						output: cacheDirectory,
						padding,
						scale,
						stripStyle,
						transparent,
					})

					await fs.rename(outputFile, sourceCachePath)

					if (verbose) {
						const sizeReport = await getPrettyFileSize(sourceCachePath)
						const timeReport = prettyMilliseconds(performance.now() - startTime)
						console.log(
							`\n[vite-tldr-plugin] Finished generating image:\n  From:\t"${sourcePathRelative}"\n  To:\t"${sourceCachePathRelative}"\n  Size:\t${sizeReport}\n  Time:\t${timeReport}`,
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

async function getFileHash(filePath: string, tldrawOptions?: TldrawImageOptions): Promise<string> {
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

async function getPrettyFileSize(file: string): Promise<string> {
	try {
		const { size } = await fs.stat(file)
		return prettyBytes(size)
	} catch (error) {
		console.error(error)
		return 'unknown'
	}
}

function stripUndefined(
	options: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (options === undefined) return undefined
	return Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined))
}
