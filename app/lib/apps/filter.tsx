import { use$ } from '@legendapp/state/react';
import { ActionIcon, Button, Modal, RangeSlider, Space, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LuFilter, LuPlus } from 'react-icons/lu';

import { view$ } from '~/lib/apps/apps';

export const PLAYER_COUNT_MAP = [
	{ value: 0, label: '1', count: 1 },
	{ value: 1, label: '2', count: 2 },
	{ value: 2, label: '3', count: 3 },
	{ value: 3, label: '4', count: 4 },
	{ value: 4, label: '6', count: 6 },
	{ value: 5, label: '8', count: 8 },
	{ value: 6, label: '8+', count: 9999 },
];

const marks = PLAYER_COUNT_MAP.map(({ value, label }) => ({ value, label }));

function Filter() {
	const [opened, { open, close }] = useDisclosure(false);
	const rangeStart = use$(view$.playerRangeStart);
	const rangeEnd = use$(view$.playerRangeEnd);
	const genreList = use$(view$.genreList);
	const selectedGenres = use$(view$.selectedGenres);
	return (
		<div className="fixed bottom-4 right-4 z-50">
			<ActionIcon variant="filled" color="blue" size={55} radius="xl" onClick={open}>
				<LuFilter size={20} />
			</ActionIcon>
			<Modal opened={opened} onClose={close} title="Filter" centered size="xl">

				{/* Number of Players */}
				<p className="text-sm font-medium">Number of Players</p>
				<Space h="xs" />
				<RangeSlider
					value={[rangeStart, rangeEnd]}
					onChange={([start, end]) => {
						view$.playerRangeStart.set(start);
						view$.playerRangeEnd.set(end);
					}}
					color="blue"
					min={0}
					max={6}
					step={1}
					marks={marks}
					label={null}
					minRange={0}
				/>
				<Space h="xl" />

				{/* Genre */}
				<p className="text-sm font-medium">Genres</p>
				<div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
					{genreList.map(genre => (
						<div
							key={genre}
							onClick={() => {
								if (selectedGenres.includes(genre)) {
									view$.selectedGenres.set(selectedGenres.filter(g => g !== genre));
								} else {
									view$.selectedGenres.set([...selectedGenres, genre]);
								}
							}}
							className={`
								cursor-pointer rounded-md border border-solid border-nintendo-border p-2 text-center text-sm transition-colors duration-200
								${selectedGenres.includes(genre)
							? 'border-none bg-[var(--mantine-color-blue-filled)] text-white'
							: ''
						}
							`}
						>
							{genre}
						</div>
					))}
				</div>
				<Space h="xs" />
			</Modal>
		</div>
	);
}

export default Filter;
