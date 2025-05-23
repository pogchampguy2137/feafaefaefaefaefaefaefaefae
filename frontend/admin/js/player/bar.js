import { socket } from '../index.js';
import { getMedia, getChannel, getState } from '../handler.js';

let bar;
let videoTimeInfo;
let videoDurationInfo;

const getCurrentTime = () => {
	const state = getState();
	if (!state) return 0;
	return state.timestamp === -1
		? 0
		: (Date.now() - state.timestamp) / 1000 + state.timeWatched + getChannel()?.latency ?? 0;
};

export const convertSeconds = (totalSeconds) => {
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	hours = String(hours.toFixed(0)).padStart(2, '0');
	minutes = String(minutes.toFixed(0)).padStart(2, '0');
	seconds = String(seconds.toFixed(0)).padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
};

let modyfing = false;

export const initializeBar = () => {
	bar = document.querySelector('#bar');
	videoTimeInfo = document.querySelector('#bar-current-time');
	videoDurationInfo = document.querySelector('#bar-video-duration');

	bar.addEventListener('input', () => (modyfing = true));
	bar.addEventListener('change', () => {
		modyfing = false;
		socket.emit('admin:server:seek', bar.value);
	});
};

export const handleBar = () => {
	if (!getMedia()?.syncable || !getChannel()?.sync || getState()?.paused) return;

	const currentTime = getCurrentTime();

	if (modyfing) return;
	bar.value = currentTime;
	videoTimeInfo.textContent = convertSeconds(currentTime);
};

export const setBarDuration = (duration) => {
	bar.max = duration;
	videoDurationInfo.textContent = convertSeconds(duration);
};

setInterval(() => handleBar(), 1000);
