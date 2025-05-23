import './ui/index.js';
import { io } from 'socket.io-client';
import { recieveChannel, recieveMedia, recieveState } from './handler.js';
import { initialize } from './sync/player/players.js';
import { sendNotification } from './notifications.js';
import { handleQueue } from './sync/queue.js';
import { initializeAccount } from './ui/account.js';

export const PAGE_URL = window.location.hostname;
export const BACKEND_URL = window.location.href;

export let socket;

window.addEventListener('DOMContentLoaded', () => {
	initialize();

	const auth = Cookies.get('account') || '{}';
	//console.info(`[streamplus] Logged as ${account.username} (${account.id})`);
	socket = io(BACKEND_URL, {
		auth: JSON.parse(auth),
	});
	socket.emit('user:server:join');

	socket.on('user:login:success', (user) => initializeAccount(user));

	socket.on('user:client:notification', ({ type, message }) => {
		console.info(`[streamplus-notification] [${type}]: ${message}`);
		sendNotification(type, message);
	});

	socket.on('user:client:channel', recieveChannel);
	socket.on('user:client:media', recieveMedia);
	socket.on('user:client:state', recieveState);

	handleQueue(socket);
});
