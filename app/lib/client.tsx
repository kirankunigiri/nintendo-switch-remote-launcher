import { MantineProvider } from '@mantine/core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ClientOnly } from 'remix-utils/client-only';

import { theme } from '~/lib/theme/mantine-theme';

function Client({ children }: { children?: React.ReactNode }) {
	return (
		<ClientOnly>
			{() => (
				<ClientComponent>
					{children}
				</ClientComponent>
			)}
		</ClientOnly>
	);
}

function ClientComponent({ children }: { children?: React.ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: 1000 * 60 * 60 * 24, // 24 hours
				staleTime: 1000 * 60 * 60, // 1 hour
			},
		},
	});

	const persister = createSyncStoragePersister({
		storage: window.localStorage,
		key: 'NINTENDO_CACHE',
	});

	return (
		<MantineProvider theme={theme}>
			<PersistQueryClientProvider
				client={queryClient}
				persistOptions={{
					persister,
					maxAge: 1000 * 60 * 60 * 24, // 24 hours
				}}
			>
				{children}
			</PersistQueryClientProvider>
		</MantineProvider>
	);
}

export default Client;
