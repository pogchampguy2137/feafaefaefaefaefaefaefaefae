import Cache from '../cache.js';
import { getCurrentPlayer } from './player/players.js';
import { getMedia, getChannel } from '../handler.js';
import { isLocalPaused } from './player/pause.js';
import { handleBar } from '../ui/bar.js';
import { cameraPlayer } from './channel.js';

let lastAutoLatency = 0;

export const handleState = (state) => {
	if (!getCurrentPlayer()?.isReady()) return;
	if (!getMedia()?.syncable || !getChannel()?.sync) return;
	if (isLocalPaused()) return;
	const player = getCurrentPlayer();
	if (!player) return;

	if (state.paused) player.pause();
	else player.play();

	const currentTime = player.getCurrentTime();
	if (currentTime === undefined)
		return console.info("[streamplus-player] Couldn't sync player, because currentTime is undefined");

	const ignoreLatency = Cache.get('ui:player:ignoreLatency', false);
	if (ignoreLatency) console.info('[streamplus-player] Ignoring channel latency');
	let latency = ignoreLatency ? 0 : Math.abs(getChannel()?.latency) ?? 0;
	if (getChannel()?.latencyMode === 'auto' && cameraPlayer && !ignoreLatency) {
		const broadcasterLatency = cameraPlayer.getPlaybackStats()?.hlsLatencyBroadcaster;
		if (broadcasterLatency !== 0) {
			latency = cameraPlayer.getPlaybackStats()?.hlsLatencyBroadcaster;
			lastAutoLatency = latency;
			console.info('[streamplus-player] Auto latency mode:', latency);
		} else if (lastAutoLatency !== 0) latency = lastAutoLatency;
	}

	let serverTime = state.timestamp === -1 ? 0 : (Date.now() - state.timestamp) / 1000 + state.timeWatched - latency;
	if (serverTime < 1) serverTime = 0;
	if (serverTime > getMedia().duration) {
		serverTime = getMedia().duration;
		player.pause();
	}

	const lag = Math.abs(currentTime - serverTime);
	if (lag > 1.5 && !state.paused) {
		player.seek(serverTime);
		console.info(`[streamplus-player] video lag is too big (${lag.toFixed(2)}s) seeking to ${serverTime}s`);
		handleBar();
	}
};
