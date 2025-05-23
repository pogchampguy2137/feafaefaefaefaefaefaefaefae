import Cache from '../cache.js';
import { getCurrentPlayer } from '../sync/player/players.js';

let windowMuted = true;
let currentVolume = 0;
let oldVolume;

export const isWindowMuted = () => windowMuted;
export const getVolume = () => currentVolume;

let icon;
let range;

const updateIcon = (volume) => {
	if (volume < 1) icon.src = 'img/controls/volume-mute.svg';
	else if (volume <= 40) icon.src = 'img/controls/volume-min.svg';
	else icon.src = 'img/controls/volume-max.svg';
};

export const setVolume = (volume, windowMute = false, button = false) => {
	currentVolume = volume / 100;
	if (!button) oldVolume = currentVolume;
	range.value = volume;

	updateIcon(volume);

	const player = getCurrentPlayer();
	if (!player) return;
	if (player.setVolume !== undefined) player.setVolume(currentVolume);

	if (currentVolume !== 0 && !windowMuted && player.unmute !== undefined) {
		player.unmute();
	}
};

window.addEventListener('DOMContentLoaded', () => {
	const unMute = document.querySelector('.player > .unmute');
	unMute.addEventListener('click', () => {
		windowMuted = false;
		unMute.style.display = 'none';
		setVolume(Cache.get('ui:volume:value', 10), true);
	});

	const volume = document.querySelector('.volume');
	icon = volume.querySelector('img');
	range = volume.querySelector('input');
	range.addEventListener('input', () => {
		if (windowMuted) return;
		setVolume(range.value);
		Cache.set('ui:volume:value', parseInt(range.value));
	});
	volume.querySelector('#volume-button').addEventListener('click', () => {
		if (oldVolume === undefined) return;
		if (currentVolume > 0) {
			oldVolume = currentVolume;
			setVolume(0, false, true);
		} else {
			setVolume(oldVolume * 100);
		}
	});
});
