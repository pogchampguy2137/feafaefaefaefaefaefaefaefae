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
	const statement = database.query('REPLACE INTO roles (user_id, role) VALUES (?, ?)');

	// This check relies on the 'roles' object existing in your original context.
	// If `roles` is not defined globally or imported, this line will cause an error.
	// You might need to pass `roles` as an argument or import it.
	// For now, I'm keeping it as it was in your original logic,
	// but be aware of its dependency.
	if (!Object.keys(roles).includes(role.toString())) {
		return false;
	}

	const info = statement.run(id, role);
	return info.changes > 0;
};

export const getRole = (id) => {
	const statement = database.query('SELECT role FROM roles WHERE user_id = ?');
	const role = statement.get(id); // Bun SQLite's .get() returns the row directly, or undefined

	if (role) {
		return role.role;
	} else {
		return 0; // Default role if not found
	}
};
