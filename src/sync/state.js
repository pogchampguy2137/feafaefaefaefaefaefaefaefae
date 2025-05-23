import fs from 'fs';
import Logger from '../logger';
import { STATE } from '../constants';
import { broadcastState } from './users';
import { getMedia } from './media';

let currentState;

if (!fs.existsSync('./data/')) fs.mkdirSync('./data/');
if (!fs.existsSync('./data/state.json')) fs.writeFileSync('./data/state.json', JSON.stringify(STATE, null, 4), 'utf-8');
currentState = JSON.parse(fs.readFileSync('./data/state.json', 'utf-8'));
currentState.paused = true;
currentState.timestamp = -1;
Logger.info(
	`Loaded current channel: ${currentState.timeWatched} @ [paused: ${currentState.paused}] ${new Date(
		currentState.timestamp
	).toLocaleString()}`
);

export const getState = () => currentState;
export const saveState = () => fs.writeFileSync('./data/state.json', JSON.stringify(currentState, null, 4), 'utf-8');
export const resetState = () => {
	currentState.timeWatched = 0;
	currentState.timestamp = play ? Date.now() : -1;
	currentState.paused = true;
	broadcastState();
};

export const play = (currentTime) => {
	if (!currentState.paused || !getMedia().syncable) return;
	Logger.debug('Changing state [play]:', currentTime);

	currentState.paused = false;
	if (currentTime) currentState.timeWatched = currentTime;
	currentState.timestamp = Date.now();

	broadcastState();
};

export const pause = () => {
	if (currentState.paused || !getMedia().syncable) return;
	Logger.debug('Changing state [pause]');

	currentState.paused = true;
	currentState.timeWatched = (Date.now() - currentState.timestamp) / 1000 + currentState.timeWatched;
	currentState.timestamp = -1;

	broadcastState();
};

export const seek = (currentTime) => {
	if (!getMedia().syncable) return;
	Logger.debug('Changing state [seek]:', currentTime);

	currentState.timeWatched = currentTime;
	currentState.timestamp = Date.now();

	broadcastState();
};
