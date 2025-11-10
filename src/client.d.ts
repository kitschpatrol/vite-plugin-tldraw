// Duplicated from src/index.ts, references seem to mess up ambient module declarations?
type TldrawImageResultMetadata = {
	format: 'png' | 'svg'
	height: number
	src: string
	width: number
}

declare module '*.tldr' {
	const content: string | TldrawImageResultMetadata
	export default content
}

// Workarounds for https://github.com/microsoft/TypeScript/issues/38638

declare module '*&tldr' {
	const content: string | TldrawImageResultMetadata
	export default content
}

declare module '*&tldraw' {
	const content: string | TldrawImageResultMetadata
	export default content
}
