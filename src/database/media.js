import database from './database';

export const addMedia = (media) => {
	let priority = 1; //TODO Add add as first option

	const statement = database.prepare(
		'INSERT INTO media (id, priority, sourceList, defaultSource, type, duration, syncable, title, description, thumbnail, url, username, userId, userAvatar, addedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
	);

	const info = statement.run(
		media.id,
		priority,
		JSON.stringify(media.sourceList),
		media.defaultSource,
		media.type,
		media.duration ?? -1,
		media.syncable ? 1 : 0,
		media.title,
		media.description,
		media.thumbnail,
		media.url,
		media.username,
		media.userId,
		media.userAvatar,
		media.addedAt
	);

	return info.changes > 0;
};

const formatVideo = (video) => {
	video.sourceList = JSON.parse(video.sourceList);
	video.syncable = video.syncable === 1 ? true : false;
	return video;
};

export const getAllMedia = () => {
	const statement = database.prepare('SELECT * FROM media ORDER BY addedAt ASC, priority DESC');
	const videos = statement.all().filter(formatVideo);
	return videos;
};

export const getMedia = (limit = 1) => {
	const statement = database.prepare('SELECT * FROM media ORDER BY addedAt ASC, priority DESC LIMIT ?');
	const videos = statement.all(limit).filter(formatVideo);
	return videos;
};

export const getMediaById = (id) => {
	const statement = database.prepare('SELECT * FROM media WHERE id = ?');
	return formatVideo(statement.get(id));
};

export const getNextMedia = () => {
	const videos = getMedia(1);
	if (videos.length < 1) return;
	return videos[0];
};

export const removeMediaById = (id) => {
	const statement = database.prepare('DELETE FROM media WHERE id = ?');
	const info = statement.run(id);
	return info.changes > 0;
};
