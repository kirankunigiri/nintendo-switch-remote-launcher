import { MantineProvider } from '@mantine/core';
import { ClientOnly } from 'remix-utils/client-only';

function Client({ children }: { children?: React.ReactNode }) {
	return (
		<ClientOnly>
			{() => (
				<MantineProvider>
					{children}
				</MantineProvider>
			)}
		</ClientOnly>
	);
}

export default Client;
