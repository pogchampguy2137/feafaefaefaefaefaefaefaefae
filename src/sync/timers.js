import { saveState, getState } from './state';
import { broadcastState } from './users';
import { getChannel } from './channel';
import { getMedia, playNextMedia } from './media';
import { findUsers, broadcastViewers } from './viewers';

setInterval(() => {
	saveState();
	broadcastState();
}, 15_000);

setInterval(() => {
	const channel = getChannel();
	const media = getMedia();
	const state = getState();
	if (channel.sync && channel.autoplay && media.syncable && !state.paused) {
		const currentTime =
			state.timestamp === -1 ? 0 : (Date.now() - state.timestamp) / 1000 + state.timeWatched + channel.latency ?? 0;
		if (currentTime - 1 > media.duration) playNextMedia();
	}
}, 1000);

setInterval(() => {
	findUsers();
	broadcastViewers();
}, 60_000);
