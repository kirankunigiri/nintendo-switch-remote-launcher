import { spawnSync } from 'node:child_process';
import { networkInterfaces } from 'node:os';

import chokidar from 'chokidar';
import cors from 'cors';
import { build } from 'esbuild';
import express from 'express';
import serveStatic from 'serve-static';

const baseUrl = process.argv[2];
if (!baseUrl) {
	console.log('Error! You must specify the URL of the Switch application!');
	process.exit(2);
}
console.log(`Switch URL: ${new URL(baseUrl)}`);

const url = new URL('/__dev', baseUrl);

const host = Object.values(networkInterfaces())
	.flatMap(i => i)
	.find(i => !i.internal && i.family === 'IPv4');
if (!host) {
	throw new Error('Could not determine host IP address');
}
const DEV_HOST = `http://${host.address}:8080/`;
console.log(`  Host URL: ${DEV_HOST}`);

const app = express();
app.use(cors());
app.use(serveStatic('build/client'));
app.listen(8080);

chokidar
	.watch('app', { ignoreInitial: true })
	.on('all', async (event, path) => {
		console.log(`${event}: ${path}`);

		console.time('Rebuilding');
		try {
			spawnSync('remix', ['vite:build'], {
				stdio: 'inherit',
				env: {
					...process.env,
					DEV_HOST,
				},
			});
		} catch (err) {
			console.error(err);
			return;
		} finally {
			console.timeEnd('Rebuilding');
		}

		const bundle = await build({
			entryPoints: ['build/server/index.js'],
			bundle: true,
			write: false,
			format: 'cjs',
		});
		const output = bundle.outputFiles[0];
		console.log('Updating dev server');
		console.time('Dev server ready');
		try {
			await fetch(url, {
				method: 'POST',
				body: output.contents,
			});
		} catch (err) {
			if (err.cause?.code === 'ECONNREFUSED') {
				console.error(
					'ERROR: Please ensure the Remix app is running on your Switch in Development Mode',
				);
			} else {
				console.error(err);
			}
		} finally {
			console.timeEnd('Dev server ready');
		}
	});
