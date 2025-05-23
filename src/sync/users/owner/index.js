import { generateCode } from '../../../server/api/invite';
import Logger from '../../../logger';

const listeners = {};

const addListener = (name, callback) => {
	listeners[name] = callback;
};
export const registerOwner = (socket) =>
	Object.keys(listeners).forEach((name) => {
		socket.on(name, (...args) => listeners[name](socket, ...args));
	});

addListener('owner:server:invite', (socket, roleId) => {
	Logger.info('Created new invite code for', roleId, 'role id');
	socket.emit('owner:client:invite', `/invite/${generateCode(roleId)}`);
});
