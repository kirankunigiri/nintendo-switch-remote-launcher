import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	// Base JavaScript and React configuration
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['!**/.server', '!**/.client'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.es6,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		extends: [
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...fixupConfigRules(pluginReactConfig),
			stylistic.configs['recommended-flat'],
			...tailwind.configs['flat/recommended'],
		],
		plugins: {
			'@stylistic': stylistic,
			'react-hooks': fixupPluginRules(eslintPluginReactHooks),
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			// ESLint react-hooks recommended config
			...eslintPluginReactHooks.configs.recommended.rules,

			// Stylistic
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent': ['warn', 'tab'],
			'@stylistic/jsx-indent': ['warn', 'tab'],
			'@stylistic/jsx-indent-props': ['warn', 'tab'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/jsx-one-expression-per-line': 'off',
			'@stylistic/brace-style': ['error', '1tbs'],

			// JavaScript
			'prefer-template': 'error',
			'no-useless-assignment': 'error',

			// TypeScript
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/array-type': 'error',
			'@typescript-eslint/consistent-indexed-object-style': 'error',

			// React
			'react/react-in-jsx-scope': 'off',

			// Simple Import Sort
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
		settings: {
			react: {
				version: 'detect',
			},
			formComponents: ['Form'],
			linkComponents: [
				{ name: 'Link', linkAttribute: 'to' },
				{ name: 'NavLink', linkAttribute: 'to' },
			],
		},
	},

	// TypeScript specific configuration
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: true,
			},
		},
		settings: {
			'import/internal-regex': '^~/',
			'import/resolver': {
				node: {
					extensions: ['.ts', '.tsx'],
				},
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
	},

	// JSON configuration
	{
		files: ['**/*.json'],
		extends: [...eslintPluginJsonc.configs['flat/recommended-with-json']],
		rules: {
			'jsonc/indent': ['error', 'tab', {}],
			'jsonc/no-comments': 'off',
		},
	},

	// package.json configuration
	{
		files: ['**/package.json'],
		rules: {
			'jsonc/no-comments': 'error',
			'jsonc/sort-keys': [
				'error',
				{
					pathPattern: '^$',
					order: [
						'name',
						'version',
						'private',
						'type',
						'publishConfig',
						'scripts',
						'dependencies',
						'devDependencies',
					],
				},
				{
					pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
					order: { type: 'asc' },
				},
			],
		},
	},

	// Tailwind config
	{
		settings: {
			tailwindcss: {
				callees: ['classnames', 'clsx', 'ctl', 'cva', 'tv', 'tw'],
				tags: ['tw'],
			},
		},
	},
);
