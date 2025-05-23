import { getChannel } from '../../channel';
import { getMedia } from '../../media';
import { getState } from '../../state';
import { getAllMedia } from '../../../database/media';

export const sendNotification = (socket, type, message) => {
	socket.emit('user:client:notification', { type, message });
};

export const sendWelcome = (socket) => {
	sendChannel(socket);
	sendMedia(socket);
	sendState(socket);
	sendQueue(socket);
};

export const sendChannel = (socket) => socket.emit('user:client:channel', getChannel());
export const sendMedia = (socket) => socket.emit('user:client:media', getMedia());
export const sendState = (socket) => socket.emit('user:client:state', getState());
export const sendQueue = (socket) => socket.emit('user:client:queue:all', getAllMedia());
