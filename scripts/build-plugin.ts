import esbuild from 'esbuild'

await esbuild.build({
	bundle: true,
	entryPoints: ['src/index.ts'],
	external: ['@kitschpatrol/tldraw-cli', 'vite'],
	format: 'esm',
	minify: true,
	outfile: 'dist/index.js',
	platform: 'node',
	target: 'node18',
})
