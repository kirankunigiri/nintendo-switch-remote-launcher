import * as http from '@nx.js/http';
import {
	createRequestHandler,
	type ServerBuild,
} from '@remix-run/server-runtime';

import * as build from '../build/server/index.js';
let serverBuild = build as unknown as ServerBuild;

let requestHandler: http.ServerHandler;
const staticHandler = http.createStaticFileHandler('romfs:/public/');

declare const DEV_MODE: boolean;
if (DEV_MODE) {
	requestHandler = (req: Request) => createRequestHandler(serverBuild)(req);
} else {
	requestHandler = createRequestHandler(build as unknown as ServerBuild);
}

const port = 8080;
http.listen({
	port,

	async fetch(req) {
		if (
			DEV_MODE
			&& req.method === 'POST'
			&& new URL(req.url).pathname === '/__dev'
		) {
			const module: any = {};
			new Function('module', await req.text())(module);
			serverBuild = module.exports;
			console.log(`Dev server updated: ${new Date()}`);
			return new Response(null, { status: 202 });
		}
		let res = await staticHandler(req);
		if (!res) res = await requestHandler(req);
		return res;
	},
});

// Prevent auto-lock / screen dimming
Switch.setMediaPlaybackState(true);
addEventListener('unload', () => {
	Switch.setMediaPlaybackState(false);
});

const { ip } = Switch.networkInfo();
const url = `http://${ip}:${port}`;
console.log(`HTTP server listening at: ${url}`);

if (DEV_MODE) {
	console.log();
	console.log('\x1B[1m\x1B[33mDEVELOPMENT MODE\x1B[39m\x1B[22m');
	console.log(
		`\x1B[33mRun the following command on your local machine:\x1B[39m`,
	);
	console.log();
	console.log(`  $ \x1B[36mnpm run dev ${url}\x1B[39m`);
	console.log();
}
