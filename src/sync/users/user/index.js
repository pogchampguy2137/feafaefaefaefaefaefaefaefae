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

addListener('user:server:addVideo', async (socket, url) => {
	if (!socket.user) return sendNotification(socket, 'error', 'Log in to have access to adding video to the queue.');
	if (!getChannel().mediaRequest)
		return sendNotification(socket, 'error', "You can't add video, because queue is disabled.");

	const username = socket.user.display_name;
	const userId = socket.user.id;
	const userAvatar = socket.user.avatar_url;
	const media = await formatMedia({
		sourceList: {
			default: url,
		},
		defaultSource: 'default',
		username,
		userId,
		userAvatar,
		addedAt: Date.now(),
	});

	if (!media) {
		Logger.warn(`${username} (${userId}) tried to add media - ${url}`);
		sendNotification(
			socket,
			'error',
			`Something went wrong with adding your video (${url}). Try again later. [fetch-error]`
		);
		return;
	}
	if (addMedia(media)) {
		Logger.info(`${username} (${userId}) added new media - ${url} [${media.type}]`);
		sendNotification(socket, 'info', 'Your video has been added to queue.');
		broadcastQueue();
	} else
		sendNotification(
			socket,
			'error',
			`Something went wrong with adding your video (${url}). Try again later. [database-error]`
		);
});
