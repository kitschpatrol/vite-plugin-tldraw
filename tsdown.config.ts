import { defineConfig } from 'tsdown'

export default defineConfig({
	attw: {
		profile: 'esm-only',
	},
	copy: ['src/client.d.ts'],
	deps: {
		neverBundle: ['fsevents', 'vite'],
	},
	fixedExtension: false,
	platform: 'node',
	publint: true,
	tsconfig: './tsconfig.build.json',
})
