import database from './database';

const roles = {
	2: 'owner',
	1: 'admin',
	0: 'default',
};

export const formatRole = (roleId) => {
	if (roleId > 2) roleId = 0;
	return roles[roleId];
};

export const addRole = (id, role) => {
	const statement = database.prepare('REPLACE INTO roles (user_id, role) VALUES (?, ?)');

	if (!Object.keys(roles).includes(role.toString())) return;

	const info = statement.run(id, role);
	return info.changes > 0;
};

export const getRole = (id) => {
	const statement = database.prepare('SELECT role FROM roles WHERE user_id = ?');
	const role = statement.get(id);
	if (role) return role.role;
	else return 0;
};
