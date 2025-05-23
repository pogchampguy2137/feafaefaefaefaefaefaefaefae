import { sendNotification } from '../notifications.js';
import { socket } from '../index.js';

let account;

let loginButton;
let requestVideoButton;

export const initializeAccount = (user) => {
	account = user;

	loginButton = document.querySelector('#login-button');
	requestVideoButton = document.querySelector('#request-video-button');

	loginButton.href = '/account/logout';
	loginButton.querySelector('span').textContent = 'Log Out';

	requestVideoButton.style.display = 'flex';

	requestVideoButton.addEventListener('click', () => {
		requestVideoButton.disabled = true;
		setTimeout(() => (requestVideoButton.disabled = false), 5000);
		const url = prompt('Enter URL (YouTube/streamable/TikTok/Discord)');
		try {
			console.log(url);
			new URL(url);
			socket.emit('user:server:addVideo', url);
			console.info('[streamplus] Requesting video', url);
		} catch (error) {
			sendNotification('error', 'This is not a valid URL.');
		}
	});
};
