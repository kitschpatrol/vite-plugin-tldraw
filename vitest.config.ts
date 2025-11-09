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
			screenshotFailures: false,
		},
		dir: 'test',
		env: {
			// eslint-disable-next-line ts/naming-convention, node/no-unsupported-features/node-builtins
			PROJECT_ROOT: import.meta.dirname,
		},
		silent: 'passed-only',
	},
})
