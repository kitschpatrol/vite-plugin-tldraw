import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		ignores: ['**/changelog.md'],
		type: 'lib',
	},
	{
		files: ['readme.md/*.ts'],
		rules: {
			'ts/triple-slash-reference': 'off',
		},
	},
)
