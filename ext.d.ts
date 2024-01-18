declare module '*.tldr' {
	const content: string
	export default content
}

// Workaround for https://github.com/microsoft/TypeScript/issues/38638
declare module '*&tldr' {
	const content: string
	export default content
}
