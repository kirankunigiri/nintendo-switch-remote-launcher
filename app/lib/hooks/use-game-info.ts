import { useQuery } from '@tanstack/react-query';
import { getQueriedGamesAmerica } from 'nintendo-switch-eshop';

const fetchGameInfo = async (gameTitle: string) => {
	try {
		const games = await getQueriedGamesAmerica(gameTitle);
		return games.length > 0 ? games[0] : null;
	} catch (error) {
		console.log('Error fetching game info:', error);
		return null;
	}
};

// New hook definition
export function useGameInfo(gameTitle: string) {
	return useQuery({
		queryKey: ['gameInfo', gameTitle],
		queryFn: () => fetchGameInfo(gameTitle),
	});
}
