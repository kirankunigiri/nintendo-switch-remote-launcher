import { use$ } from '@legendapp/state/react';
import { TextInput } from '@mantine/core';
import { LuSearch } from 'react-icons/lu';

import { view$ } from '~/lib/apps/apps';

function Search() {
	const search = use$(view$.search);

	return (
		<>
			<TextInput
				leftSection={<LuSearch size={16} />}
				className="w-full px-2"
				size="xs"
				placeholder="Search"
				value={search}
				onChange={e => (view$.search.set(e.target.value))}
			/>
		</>
	);
}

export default Search;
