export const sendNotification = (socket, type, message) => {
	socket.emit('admin:client:notification', { type, message });
};
