import { play } from '../../state';
import { pause } from '../../state';
import { seek } from '../../state';
import { formatMedia, playMedia, playNextMedia } from '../../media';
import { addMedia } from '../../../database/media';
import { setChannel } from '../../channel';
import { broadcastQueue } from '../';
import { getUsers, getCount } from '../../viewers';

const listeners = {};

const addListener = (name, callback) => {
	listeners[name] = callback;
};
export const registerAdmin = (socket) =>
	Object.keys(listeners).forEach((name) => {
		socket.on(name, (...args) => listeners[name](socket, ...args));
	});

addListener('admin:server:join', (socket) => {
	socket.emit('admin:client:joined');
	socket.join('admin:room');
});

addListener('admin:server:play', () => play());
addListener('admin:server:pause', () => pause());
addListener('admin:server:playNow', (socket, media) => playMedia(media, true, true));
addListener('admin:server:seek', (socket, currentTime) => seek(parseInt(currentTime)));
addListener('admin:server:skip', () => playNextMedia());
addListener('admin:server:channel', (socket, channel) => setChannel(channel));
addListener('admin:server:add', async (socket, media) => {
	// TODO Handle users
	media = await formatMedia(media);
	if (!media) return;
	if (addMedia(media)) broadcastQueue();
});
addListener('admin:server:viewers', (socket) =>
	socket.emit('admin:client:viewers', { count: getCount(), users: getUsers() })
);
