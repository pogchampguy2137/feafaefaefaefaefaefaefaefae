import { io } from '../../server/sockets';
import { getChannel } from '../channel';
import { getMedia } from '../media';
import { getState } from '../state';
import { getAllMedia } from '../../database/media';

export const broadcastChannel = () => io.emit('user:client:channel', getChannel());
export const broadcastMedia = () => io.emit('user:client:media', getMedia());
export const broadcastState = () => io.emit('user:client:state', getState());
export const broadcastQueue = () => io.emit('user:client:queue:all', getAllMedia());

export const broadcastNotification = (type, message) => io.emit('user:client:notification', { type, message });
export const broadcastAdminNotification = (type, message) =>
	io.to('admin:room').emit('admin:client:notification', { type, message });
