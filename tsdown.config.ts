import { defineConfig } from 'tsdown'

export default defineConfig({
	attw: {
		profile: 'esmOnly',
	},
	copy: ['src/client.d.ts'],
	external: ['fsevents', 'vite'],
	fixedExtension: false,
	platform: 'node',
	tsconfig: './tsconfig.build.json',
})
