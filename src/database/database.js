import Database from 'better-sqlite3';
const database = new Database('database.db');

database
	.prepare(
		'CREATE TABLE IF NOT EXISTS media (id VARCHAR(128), priority INT(10), sourceList TEXT, defaultSource VARCHAR(64), type VARCHAR(36), duration INT(24), syncable INTEGER(1), title VARCHAR(128), description VARCHAR(256), thumbnail VARCHAR(2048), url VARCHAR(2048), username VARCHAR(36), userId INT(24), userAvatar VARCHAR(2048), addedAt BIGINT)'
	)
	.run();
database
	.prepare(
		'CREATE TABLE IF NOT EXISTS users (id VARCHAR(128) PRIMARY KEY, display_name VARCHAR(64), username VARCHAR(64), avatar_url VARCHAR(2048), token VARCHAR(64), expire BIGINT)'
	)
	.run();
database.prepare('CREATE TABLE IF NOT EXISTS roles (user_id INT(32) PRIMARY KEY, role INTEGER(1))').run();

export default database;
