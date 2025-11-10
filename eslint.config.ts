import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		ts: {
			overrides: {
				'import/no-duplicates': 'off',
			},
		},
		type: 'lib',
	},
	{
		files: ['readme.md/*.ts'],
		rules: {
			'import/no-unresolved': 'off',
			'ts/triple-slash-reference': 'off',
		},
	},
)
