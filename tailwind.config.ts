import type { Config } from 'tailwindcss';

export default {
	darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji',
				],
			},
			colors: {
				'nintendo-dark': '#2D2D2D',
				'nintendo-light': '#EBEBEB',
				'nintendo-bg': 'light-dark(var(--nintendo-bg-light), var(--nintendo-bg-dark))',
				'nintendo-border-light': '#EBEBEB',
				'nintendo-border-dark': '#2D2D2D',
				'nintendo-border': 'light-dark(var(--nintendo-border-light), var(--nintendo-border-dark))',
			},
		},
	},
	plugins: [],
} satisfies Config;
