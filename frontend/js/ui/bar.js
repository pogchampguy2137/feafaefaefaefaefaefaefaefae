import { getCurrentPlayer } from '../sync/player/players.js';
import { getMedia, getChannel } from '../handler.js';

let bar;
let videoTime;

window.addEventListener('DOMContentLoaded', () => {
	bar = document.querySelector('.controls__bar--progress');
	videoTime = document.querySelector('#controls__time');
});

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

export const handleBar = () => {
	if (!getMedia()?.syncable || !getChannel()?.sync) return;
	const player = getCurrentPlayer();
	if (!player) return;

	const currentTime = player.getCurrentTime();
	if (currentTime === undefined) return;
	const duration = getMedia()?.duration;

	bar.style.width = (currentTime / duration) * 100 + '%';
	videoTime.textContent = `${convertSeconds(currentTime)} / ${convertSeconds(duration)}`;
};

setInterval(() => handleBar(), 1000);
