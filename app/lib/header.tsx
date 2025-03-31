import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { LuMoon, LuSun } from 'react-icons/lu';
import { ClientOnly } from 'remix-utils/client-only';

function Header() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<div className="flex h-[40px] w-full items-center justify-between border-b border-b-nintendo-border bg-nintendo-bg p-3">
			<p className="text-sm font-bold">Switch Remote Launcher</p>

			<ClientOnly>
				{() => (
					<ActionIcon onClick={() => toggleColorScheme()}>
						{colorScheme === 'dark' ? <LuMoon size={16} /> : <LuSun size={16} />}
					</ActionIcon>
				)}
			</ClientOnly>
		</div>
	);
}

export default Header;
