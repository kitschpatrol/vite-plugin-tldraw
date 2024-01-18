declare module '*.tldr' {
	const content: string
	export default content
}

// Workarounds for https://github.com/microsoft/TypeScript/issues/38638

declare module '*&tldr' {
	const content: string
	export default content
}

declare module '*&tldraw' {
	const content: string
	export default content
}
