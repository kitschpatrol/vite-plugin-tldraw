/* eslint-disable perfectionist/sort-objects */
/* @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: ['@kitschpatrol/eslint-config'],
	overrides: [
		{
			files: ['ext.d.ts'],
			rules: {
				'unicorn/prevent-abbreviations': 'off',
			},
		},
	],
}
