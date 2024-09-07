// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import tldrPlugin from './src/vite-plugin-tldraw'

export default defineConfig({
	plugins: [tldrPlugin({ verbose: true })],
	root: './test/assets',
	test: {
		dir: 'test',
	},
})
