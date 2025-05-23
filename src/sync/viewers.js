import { io } from '../server/sockets';

let count = 0;
let users = [];

export const findUsers = () => {
	count = io.of('/').sockets.size;
	users = [];
	io.sockets.sockets.forEach((socket) => {
		if (socket.user.logged && !users.find((user) => user.id === socket.user.id))
			users.push({
				id: socket.user.id,
				display_name: socket.user.display_name,
				username: socket.user.username,
				role: socket.user.role,
			});
	});
};
setTimeout(() => {
	findUsers();
}, 3_000);

export const broadcastViewers = () => {
	io.to('admin:room').emit('admin:client:viewers', {
		count,
		users,
	});
};

export const getUsers = () => users;
export const getCount = () => count;
