import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
	interface Future {
		v3_singleFetch: true
	}
}

export default defineConfig({
	base: process.env.DEV_HOST,
	plugins: [remix(), tsconfigPaths()],
	server: {
		host: true,
	},
});
