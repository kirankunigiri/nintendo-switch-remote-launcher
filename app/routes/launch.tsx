import type { ActionFunctionArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

export async function action({ request }: ActionFunctionArgs) {
	try {
		const { appId } = await request.json();

		if (!appId || appId === '') {
			return json(
				{ error: 'App ID is required or invalid format' },
				{ status: 400 },
			);
		}

		// Convert appId to number if it's a title ID
		// BigInt(`0x${appId}`)
		const titleId = BigInt(appId);
		const app = new Switch.Application(titleId);
		await app.launch();
		return json({ success: true });
	} catch (error) {
		console.error('Failed to process request:', error);
		return json(
			{ error: `Failed to process request: ${(error as Error).message}` },
			{ status: 500 },
		);
	}
}
