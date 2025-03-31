import { observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import { Box, Space, VisuallyHidden } from '@mantine/core';
import { GameUS, getQueriedGamesAmerica } from 'nintendo-switch-eshop';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PLAYER_COUNT_MAP } from '~/lib/apps/filter';

interface View {
	search: string
	playerRangeStart: number
	playerRangeEnd: number
	genreList: string[]
	selectedGenres: string[]
}

export const view$ = observable<View>({
	search: '',
	playerRangeStart: 0,
	playerRangeEnd: 6,
	genreList: [],
	selectedGenres: [],
});

export interface App {
	name: string
	version: string
	id: string
	author: string
}

interface AppsProps {
	apps: App[]
}

function Apps({ apps }: AppsProps) {
	const search = use$(view$.search);
	const filteredApps = apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="grid w-full grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 p-2">
			{filteredApps.map(app => (
				<AppItem key={app.id} app={app} />
			))}
		</div>
	);
}

export const fetchGameInfo = async (gameTitle: string) => {
	try {
		const games = await getQueriedGamesAmerica(gameTitle);
		if (games.length > 0) {
			const gameInfo = games[0];
			const currentGenres = view$.genreList.get();
			const newGenres = gameInfo.genres.filter(genre => !currentGenres.includes(genre));
			if (newGenres.length > 0) {
				view$.genreList.set([...currentGenres, ...newGenres]);
			}
			return gameInfo;
		} else {
			console.log('Game not found.');
		}
	} catch (error) {
		console.log('Error fetching game info:', error);
	}
};

const extractPlayerCount = (playerString: string | undefined): string => {
	if (!playerString) return '?';
	const match = playerString.match(/\d+/);
	return match ? match[0] : '?';
};

const cleanHex = (decimal: bigint) => {
	return BigInt(decimal).toString(16).padStart(16, '0').toUpperCase();
};

const IMAGE_RES = 512;
const IMAGE_RES_STR = `${IMAGE_RES}/${IMAGE_RES}`;

function AppItem({ app }: { app: App }) {
	const [gameInfo, setGameInfo] = useState<GameUS | null>(null);
	const [imageError, setImageError] = useState(false);
	const titleId = cleanHex(BigInt(app.id));
	const playerCount = extractPlayerCount(gameInfo?.numOfPlayers || gameInfo?.playerCount);
	const playerRangeStart = use$(view$.playerRangeStart);
	const playerRangeEnd = use$(view$.playerRangeEnd);
	const selectedGenres = use$(view$.selectedGenres);

	const numericPlayerCount = parseInt(playerCount) || 1;

	// Hide games that don't match the selected player count range
	const hiddenByPlayers = numericPlayerCount < PLAYER_COUNT_MAP[playerRangeStart].count
	  || numericPlayerCount > PLAYER_COUNT_MAP[playerRangeEnd].count;

	// Hide games that don't match any of the selected genres
	// If no genres are selected, show all games
	const hiddenByGenres = selectedGenres.length > 0
	  && (!gameInfo?.genres || !gameInfo.genres.some(genre => selectedGenres.includes(genre)));

	// Combine both filters
	const hidden = hiddenByPlayers || hiddenByGenres;

	useEffect(() => {
		async function getGame() {
			const game = await fetchGameInfo(app.name);
			setGameInfo(game || null);
		}
		getGame();
	}, [app.name]);

	const handleLaunch = async (e: React.MouseEvent) => {
		e.preventDefault();

		try {
			const response = await fetch('/launch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ appId: app.id }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Failed to launch app:', error);
		}
	};

	console.log(gameInfo?.genres);

	return (
		<Box
			display={hidden ? 'none' : 'block'}
			key={app.id}
			className="flex cursor-pointer flex-col items-center"
			onClick={handleLaunch}
		>
			<div className="relative flex aspect-square w-full items-center justify-center border border-nintendo-border bg-nintendo-bg">
				{!imageError && (
					<img
						src={`https://tinfoil.media/ti/${titleId}/${IMAGE_RES_STR}`}
						alt={app.name}
						className="size-full object-cover"
						onError={() => setImageError(true)}
					/>
				)}
				<div className="absolute bottom-1 right-1 flex size-[16px] items-center justify-center rounded-full border-solid border-black bg-white opacity-80">
					<p className="text-[10px] font-bold text-black">{playerCount}</p>
				</div>
			</div>
			<Space h={4} />
			<p className="w-full truncate text-left text-xs font-medium">{app.name}</p>
		</Box>
	);
}

export default Apps;
