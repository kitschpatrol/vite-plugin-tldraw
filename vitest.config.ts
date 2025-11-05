import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import tldrPlugin from './src'

export default defineConfig({
	plugins: [tldrPlugin({ verbose: true })],
	root: './test/assets',
	test: {
		browser: {
			enabled: true,
			headless: true,
			instances: [{ browser: 'chromium' }],
			provider: playwright(),
		},
		dir: 'test',
	},
})
