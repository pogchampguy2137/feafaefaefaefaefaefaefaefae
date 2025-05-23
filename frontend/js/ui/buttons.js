import { toggleLocalPause } from '../sync/player/pause.js';
import { toggleSources } from './source.js';

// const isFullScreen = () =>
// 	window.fullScreen || (window.innerWidth == screen.width && window.innerHeight == screen.height);

window.addEventListener('DOMContentLoaded', () => {
	const playButton = document.querySelector('#play-button');
	playButton.addEventListener('click', () => {
		let pause = toggleLocalPause();
		if (pause) {
			playButton.querySelector('img').src = 'img/controls/play.svg';
		} else {
			playButton.querySelector('img').src = 'img/controls/pause.svg';
		}
	});

	const fullScreenButton = document.querySelector('#fullscreen-button');
	let fullscreen = false;
	fullScreenButton.addEventListener('click', () => {
		fullscreen = !fullscreen;
		if (fullscreen) {
			document.querySelector('body').requestFullscreen();
			fullScreenButton.querySelector('img').src = 'img/controls/no-fullscreen.svg';
		} else {
			document.exitFullscreen();
			fullScreenButton.querySelector('img').src = 'img/controls/fullscreen.svg';
		}
	});

	const sourceButton = document.querySelector('#source-button');
	const sourceList = document.querySelector('.controls__source');
	sourceButton.addEventListener('click', () => {
		let source = toggleSources();
		if (source) {
			sourceList.style.display = 'flex';
		} else {
			sourceList.style.display = 'none';
		}
	});
});
