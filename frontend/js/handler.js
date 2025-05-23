import { handleChannel } from './sync/channel.js';
import { handleMedia } from './sync/media.js';
import { handleState } from './sync/state.js';

let lastRecievedChannel;
let lastRecievedMedia;
let lastRecievedState;

export const recieveChannel = (channel) => {
	lastRecievedChannel = channel;
	lastRecievedChannel._recievedAt = Date.now();
	console.info(`[streamplus-channel]:`, lastRecievedChannel);
	handleChannel(lastRecievedChannel);
};

export const recieveMedia = (media) => {
	lastRecievedMedia = media;
	lastRecievedMedia._recievedAt = Date.now();
	console.info(`[streamplus-media]:`, lastRecievedMedia);
	handleMedia(media);
};

export const recieveState = (state) => {
	lastRecievedState = state;
	lastRecievedState._recievedAt = Date.now();
	console.info(`[streamplus-state]:`, lastRecievedState);
	handleState(state);
};

export const getChannel = () => lastRecievedChannel;
export const getMedia = () => lastRecievedMedia;
export const getState = () => lastRecievedState;

export const recieveLastMedia = (sourceRefresh) => handleMedia(lastRecievedMedia, sourceRefresh);
export const recieveLastState = () => handleState(lastRecievedState);
