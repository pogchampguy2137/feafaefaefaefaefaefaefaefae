import { recieveLastState } from '../../handler.js';
import { getCurrentPlayer } from './players.js';

let localPasue = false;

export const isLocalPaused = () => localPasue;
export const toggleLocalPause = () => {
	localPasue = !localPasue;
	const player = getCurrentPlayer();
	if (!player) return;
	if (localPasue) player.pause();
	else recieveLastState();
	return localPasue;
};
