import { server } from './server';
import { Server } from 'socket.io';
import Logger from '../logger';
import { registerUser } from '../sync/users/user';
import { registerAdmin } from '../sync/users/admin';
import { registerOwner } from '../sync/users/owner';
import { getUser } from '../database/user';
import { getRole, formatRole } from '../database/role';

export const io = new Server(server);
Logger.info('WebSockets server has started!');

io.use((socket, next) => {
	let user = {
		logged: false,
		admin: false,
		role: 'default',
	};

	const auth = socket.handshake.auth;
	if (auth) {
		const databaseUser = getUser(auth?.id);
		if (databaseUser && databaseUser.token === auth.token && Date.now() < databaseUser.expire) {
			delete databaseUser.expire;
			delete databaseUser.token;
			user = {
				...user,
				...databaseUser,
			};
			user.logged = true;

			const role = getRole(user.id);
			user.role = formatRole(role);
			user.roleId = role;
		}
	}
	socket.user = user;
	next();
});

io.on('connection', (socket) => {
	registerUser(socket);
	console.info('test', socket.user.roleId)
	if (socket.user.roleId >= 1) registerAdmin(socket);
	if (socket.user.roleId === 2) registerOwner(socket);
});
