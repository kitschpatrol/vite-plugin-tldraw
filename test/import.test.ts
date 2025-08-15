import { expect, it } from 'vitest'
import tldrFileFrame from './assets/test-sketch-three-frames.tldr?frame=frame-3&tldr'
import tldrFile from './assets/test-sketch.tldr'
/* eslint-disable perfectionist/sort-imports */
import tldrFileWithParams from './assets/test-sketch.tldr?format=png&transparent=true&tldr'
import tldrFileWithParams2 from './assets/test-sketch.tldr?format=svg&dark=true&tldr'
import tldrFileWithParams3 from './assets/test-sketch.tldr?format=svg&padding=200&tldr'
import tldrFileWithParams4 from './assets/test-sketch.tldr?format=png&scale=4&tldr'
/* eslint-enable perfectionist/sort-imports */
// Cspell:disable-next-line
import tldrFilePageWithFrame from './assets/test-sketch-three-pages.tldr?page=page-2&frame=gVS4O2yNqyRKDV4lp3Trd&tldr'
import tldrFilePage from './assets/test-sketch-three-pages.tldr?page=page-2&tldr'

it('converts tldr files to images on import', () => {
	expect(tldrFile).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-2d5c591d.svg"`,
	)
	expect(tldrFileWithParams4).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-792b5668.png"`,
	)
	expect(tldrFileWithParams).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-ecbcca7e.png"`,
	)
	expect(tldrFileWithParams2).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-83f3db27.svg"`,
	)
	expect(tldrFileWithParams3).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-e735e7ba.svg"`,
	)
	expect(tldrFileFrame).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-three-frames-frame-3-7b88b7f0.svg"`,
	)
	expect(tldrFilePageWithFrame).toMatchInlineSnapshot(
		// Cspell:disable-next-line
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-three-pages-page-2-g-vs-4-o2y-nqy-rkdv-4lp3-trd-878d9b80.svg"`,
	)
	expect(tldrFilePage).toMatchInlineSnapshot(
		`"/test/assets/node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/tldr/test-sketch-three-pages-page-2-041effe6.svg"`,
	)
})
