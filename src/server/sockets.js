import { server } from './server';
import { Server } from 'socket.io';
import Logger from '../logger';
import { registerUser } from '../sync/users/user';
import { registerAdmin } from '../sync/users/admin';
import { registerOwner } from '../sync/users/owner';
import { getUser } from '../database/user';
import { getRole, formatRole } from '../database/role';
import Config from '../config.js';

export const io = new Server(server);
Logger.info('WebSockets server has started!');

io.use((socket, next) => {
	let user = {
		logged: false,
		admin: false,
		role: 'default',
		roleId: 0
	};

	const auth = socket.handshake.auth;
	if(auth?.adminToken === Config.adminToken) {
		user.roleId = 2;
		user.admin = true;
	}
	console.info(auth, Config.adminToken, user);
	socket.user = user;
	next();
});

io.on('connection', (socket) => {
	registerUser(socket);

	console.info('test', socket.user.roleId)
	if (socket.user.roleId >= 1) registerAdmin(socket);
	if (socket.user.roleId === 2) registerOwner(socket);
});
