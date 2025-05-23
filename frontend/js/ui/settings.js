import Cache from '../cache.js';
import { getCurrentPlayer } from '../sync/player/players.js';
import { getMedia, getChannel } from '../handler.js';
import { convertSeconds } from './bar.js';

window.addEventListener('DOMContentLoaded', () => {
	const settings = document.querySelector('.settings');
	const settingsButton = document.querySelector('#settings-button');
	settingsButton.addEventListener('click', () => {
		settings.style.display = 'flex';
	});
	const background = settings.querySelector('.settings__background');
	background.addEventListener('click', () => {
		settings.style.display = 'none';
	});
	const closeButton = settings.querySelector('.settings__close');
	closeButton.addEventListener('click', () => {
		settings.style.display = 'none';
	});

	const cameraVisible = settings.querySelector('#settings-camera-visible');
	cameraVisible.checked = Cache.get('ui:camera:visible', true);
	cameraVisible.addEventListener('change', () => {
		Cache.set('ui:camera:visible', cameraVisible.checked);
	});

	const chatVisible = settings.querySelector('#settings-chat-visible');
	chatVisible.checked = Cache.get('ui:chat:visible', true);
	chatVisible.addEventListener('change', () => {
		Cache.set('ui:chat:visible', chatVisible.checked);
	});

	const ignoreLatency = settings.querySelector('#settings-ignore-latency');
	ignoreLatency.checked = Cache.get('ui:player:ignoreLatency', false);
	ignoreLatency.addEventListener('change', () => {
		Cache.set('ui:player:ignoreLatency', ignoreLatency.checked);
	});

	const timerButton = document.querySelector('#settings-timer-button');
	timerButton.addEventListener('click', () => {
		const player = getCurrentPlayer();
		if (!player) return;

		const timerWindow = window.open('', '', 'width=320,height=120');
		timerWindow.document.querySelector(
			'head'
		).innerHTML += `<link rel="stylesheet" type="text/css" href="css/timer.css">`;
		timerWindow.document.querySelector('body').innerHTML += `<div id="timer">00:00:00</span>`;

		let timerInterval = setInterval(() => {
			if (timerWindow.closed) {
				clearInterval(timerInterval);
				return;
			}
			if (!getMedia()?.syncable || !getChannel()?.sync) return;
			const player = getCurrentPlayer();
			if (!player) return;
			timerWindow.document.querySelector('#timer').textContent = convertSeconds(player.getCurrentTime());
		}, 500);
	});
});
