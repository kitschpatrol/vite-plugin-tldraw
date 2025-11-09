import { expect, it } from 'vitest'

// Get the project root path from the Vite config
// eslint-disable-next-line ts/no-unsafe-assignment
const projectRoot = import.meta.env.PROJECT_ROOT

async function fetchFilePathExists(relativePath: string): Promise<boolean> {
	// Construct @fs path using the project root
	const fsPath = `/@fs${projectRoot}${relativePath}`

	// eslint-disable-next-line node/no-unsupported-features/node-builtins -- fetch is available in browser context
	const response = await fetch(fsPath)
	return response.ok
}

it('fetches file path exists', async () => {
	expect(await fetchFilePathExists('/test/assets/test-sketch.tldr')).toBe(true)
})

it('dynamically imports static paths', async () => {
	const tldrFile = await import('./assets/test-sketch.tldr')
	expect(tldrFile).toMatchInlineSnapshot(`
		{
		  "default": "/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-2d5c591d.svg",
		}
	`)

	expect(tldrFile.default).toBeDefined()
	expect(await fetchFilePathExists(tldrFile.default)).toBe(true)
})

it('dynamically imports variable paths', async () => {
	const path = './assets/test-sketch.tldr'
	// eslint-disable-next-line ts/no-unsafe-assignment
	const tldrFile = await import(/* @vite-ignore */ path)

	// eslint-disable-next-line ts/no-unsafe-member-access
	expect(tldrFile.default).toBeDefined()
	// eslint-disable-next-line ts/no-unsafe-member-access, ts/no-unsafe-argument
	expect(await fetchFilePathExists(tldrFile.default)).toBe(true)
})
