import database from './database';

export const addUser = (user, token, expire) => {
	const statement = database.prepare(
		'REPLACE INTO users (id, display_name, username, avatar_url, token, expire) VALUES (?, ?, ?, ?, ?, ?)'
	);

	const info = statement.run(
		user.id,
		user.global_name,
		user.username,
		`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
		token,
		expire
	);

	return info.changes > 0;
};

export const getUser = (id) => {
	const statement = database.prepare('SELECT * FROM users WHERE id = ?');
	return statement.get(id);
};

export const isValidUser = (id, token) => {
	const statement = database.prepare('SELECT expire FROM users WHERE id = ? AND token = ?');
	const data = statement.get(id, token);
	if (!data || data.expire === undefined) return false;
	return data.expire > Date.now();
};
