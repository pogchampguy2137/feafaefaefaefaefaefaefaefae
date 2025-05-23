import { isWindowMuted } from './volume.js';

window.addEventListener('DOMContentLoaded', () => {
	const player = document.querySelector('.player');
	let hideTimer;
	player.addEventListener('mousemove', () => {
		if (isWindowMuted()) return;
		player.classList.add('controls--active');
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			player.classList.remove('controls--active');
			clearTimeout(hideTimer);
		}, 3000);
	});
	player.addEventListener('mouseleave', () => {
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			player.classList.remove('controls--active');
			clearTimeout(hideTimer);
		}, 3000);
	});
});
