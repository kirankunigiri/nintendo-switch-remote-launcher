import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/server-runtime';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server.browser';
// import { renderToReadableStream } from 'react-dom/server';

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	const body = await renderToReadableStream(
		<RemixServer context={remixContext} url={request.url} />,
		{
			signal: request.signal,
			onError(error: unknown) {
				console.error(error);
				responseStatusCode = 500;
			},
		},
	);

	const ua = request.headers.get('user-agent');
	if (ua && isbot(ua)) {
		await body.allReady;
	}

	responseHeaders.set('Content-Type', 'text/html');
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
