import { getChannel } from '../../channel';
import { sendNotification, sendWelcome } from './sender';
import { formatMedia } from '../../media';
import Logger from '../../../logger';
import { addMedia } from '../../../database/media';
import { broadcastQueue } from '..';

const listeners = {};

const addListener = (name, callback) => {
	listeners[name] = callback;
};
export const registerUser = (socket) => {
	sendWelcome(socket);
	if (!socket.user.logged) return;
	socket.emit('user:login:success', socket.user);
	Object.keys(listeners).forEach((name) => {
		socket.on(name, (...args) => listeners[name](socket, ...args));
	});
};

addListener('user:server:join', (socket) => {
	const username = socket.user ? socket.user.display_name : 'nameless hero';
	sendNotification(socket, 'info', `Hello ${username}!`);
});