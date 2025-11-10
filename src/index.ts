import type { TldrawToImageOptions as TldrawCliImageOptions } from '@kitschpatrol/tldraw-cli'
import type { Plugin } from 'vite'
import { tldrawToImage } from '@kitschpatrol/tldraw-cli'
import slugify from '@sindresorhus/slugify'
import { imageSizeFromFile as imageDimensionsFromFile } from 'image-size/fromFile'
import { nanoid } from 'nanoid'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { URLSearchParams } from 'node:url'
import { isFile } from 'path-type'
import prettyBytes from 'pretty-bytes'
import prettyMilliseconds from 'pretty-ms'
import { normalizePath } from 'vite'

// Returns a URL or metadata object to an svg or png generated from the tldr file
// Pass any values from TldrawImageOptions as params in the URL

export type TldrawPluginOptions = {
	cacheEnabled?: boolean
	defaultImageOptions?: TldrawImageOptions
	returnMetadata?: boolean
	verbose?: boolean
}

export type TldrawImageOptions = Pick<
	TldrawCliImageOptions,
	'dark' | 'format' | 'padding' | 'scale' | 'stripStyle' | 'transparent'
>

export type TldrawImageResultMetadata = {
	format: 'png' | 'svg'
	height: number
	src: string
	width: number
}

/**
 * Vite plugin to convert tldraw `.tldr` files to images on import
 */
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
		returnMetadata: false,
		verbose: false,
		...stripUndefined(options),
	}

	let cacheDirectory = ''
	let assetsDirectory = ''
	let isBuild = false
	let basePath = '/'

	return {
		configResolved(config) {
			cacheDirectory = path.join(config.cacheDir, 'tldr')
			assetsDirectory = config.build.assetsDir
			isBuild = config.command === 'build'
			basePath = config.base
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
					// between input and output files, we only support a single frame name or id here
					frame?: string
					// Tldraw-cli supports arrays of page names, but to maintain 1:1 relationship
					// between input and output files, we only support a single page name or id here
					page?: string
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
				const { dark, format, frame, padding, page, scale, stripStyle, transparent } =
					mergedImageOptions
				const pageName = page ? slugify(page) : undefined
				const frameName = frame ? slugify(frame) : undefined

				const sourceCacheFilename = `${[sourceFilename, pageName, frameName, sourceHash]
					.filter((element) => element !== undefined)
					.join('-')}.${format}`
				const sourceCachePathAbsolute = path.join(cacheDirectory, sourceCacheFilename)
				const sourceCachePathProject = path.join(
					'/',
					path.relative(
						process.cwd(), // TODO - is this the right path?
						sourceCachePathAbsolute,
					),
				)

				if (!cacheEnabled) {
					await fs.rm(cacheDirectory, { recursive: true })
				}

				// Check for cache, generate svg from tldr if needed
				const cacheIsValid = await isFile(sourceCachePathAbsolute)

				if (cacheIsValid) {
					if (verbose) {
						console.log(
							`\n[vite-tldr-plugin] Cache found:\n  For:\t"${sourcePathRelative}"\n  At:\t"${sourceCachePathProject}"`,
						)
					}
				} else {
					const startTime = performance.now()
					await fs.mkdir(cacheDirectory, { recursive: true })

					if (verbose && cacheEnabled) {
						console.log(
							`\n[vite-tldr-plugin] Cache missed:\n  For:\t"${sourcePathRelative}"\n  At:\t"${sourceCachePathProject}"`,
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
						pages: page ? [page] : false,
						scale,
						stripStyle,
						transparent,
					})

					await fs.rename(outputFile, sourceCachePathAbsolute)

					if (verbose) {
						const sizeReport = await getPrettyFileSize(sourceCachePathAbsolute)
						const timeReport = prettyMilliseconds(performance.now() - startTime)
						console.log(
							`\n[vite-tldr-plugin] Finished generating image:\n  From:\t"${sourcePathRelative}"\n  To:\t"${sourceCachePathProject}"\n  Size:\t${sizeReport}\n  Time:\t${timeReport}`,
						)
					}
				}

				const exportPath = isBuild
					? path.join(basePath, path.join(assetsDirectory, sourceCacheFilename))
					: sourceCachePathProject

				if (isBuild) {
					// Copy to output dir if building
					const outputFilePath = path.join(assetsDirectory, sourceCacheFilename)
					this.emitFile({
						fileName: outputFilePath,
						source: await fs.readFile(sourceCachePathAbsolute),
						type: 'asset',
					})
				}

				if (resolvedOptions.returnMetadata) {
					const { width, height } = await imageDimensionsFromFile(sourceCachePathAbsolute)

					if (format === 'tldr') {
						throw new Error(
							'tldr format is not supported as an export target in vite-plugin-tldraw',
						)
					}

					const metadata: TldrawImageResultMetadata = {
						format: format ?? 'svg',
						height,
						// Better to leave this to the consumer...
						// src: path.posix.join(
						// 	'/@fs',
						// 	process.cwd(),
						// 	`${exportPath}?${new URLSearchParams({
						// 		/* eslint-disable perfectionist/sort-objects */
						// 		origWidth: Math.round(width).toString(),
						// 		origHeight: Math.round(height).toString(),
						// 		origFormat: format ?? 'svg',
						// 		/* eslint-enable perfectionist/sort-objects */
						// 	}).toString()}`,
						// ),
						src: exportPath,
						width,
					}
					return {
						code: `export default ${JSON.stringify(metadata)};`,
					}
				}

				// Return just the URL string
				return {
					code: `export default "${exportPath}";`,
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

// eslint-disable-next-line ts/no-unnecessary-type-parameters
function convertSearchParamsToObject<T>(params: URLSearchParams): T {
	const object: Record<string, unknown> = {}
	for (const [key, value] of params.entries()) {
		object[key] = value
	}

	// eslint-disable-next-line ts/no-unsafe-type-assertion
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
