import { Divider, Space } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Buffer } from 'buffer';

import Apps, { App } from '~/lib/apps/apps';
import Filter from '~/lib/apps/filter';
import Search from '~/lib/apps/search';
import Client from '~/lib/client';
import Footer from '~/lib/footer';
import Header from '~/lib/header';
import testApps from '~/lib/test/apps.json';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Switch Remote Launcher' },
		{ name: 'description', content: 'Switch Remote Launcher' },
	];
};

export async function loader() {
	const appList: App[] = [];
	if (typeof Switch !== 'undefined') {
		for (const app of Switch.Application) {
			appList.push({
				name: app.name,
				version: app.version,
				author: app.author,
				id: app.id.toString(),
			});
		}
	} else {
		for (const app of testApps) {
			appList.push({
				name: app.name,
				version: app.version,
				author: app.author,
				id: app.id,
			});
		}
	}
	return { apps: appList };
}

export default function Index() {
	const { apps } = useLoaderData<typeof loader>();

	return (
		<Client>
			<div className="flex h-dvh w-dvw flex-col items-center">
				<Header />
				<Space h="xs" />
				<Search />
				<Filter />

				{/* Body */}
				<div className="flex w-full flex-1 flex-col overflow-y-scroll">

					{/* App Grid */}
					<Apps apps={apps} />

					<Divider />
					<Footer />
				</div>
			</div>
		</Client>
	);
}
