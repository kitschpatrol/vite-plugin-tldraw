// eslint-disable-next-line ts/triple-slash-reference
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import tldrPlugin from './src'

export default defineConfig({
	plugins: [tldrPlugin({ verbose: true })],
	root: './test/assets',
	test: {
		dir: 'test',
	},
})
