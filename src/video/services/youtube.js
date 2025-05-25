import Logger from '../../logger';
import { Duration } from 'luxon';

export const isYouTubeURL = (url) => {
	return getYouTubeId(url) !== undefined;
};

export const getYouTubeId = (url) => {
	const regex =
		/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	const matches = url.match(regex);
	if (!matches) return;
	if (matches.length > 1) return matches[1];
	return id;
};

const getYouTubeThumbnail = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

export const getYouTubeData = (url) => {
	const id = getYouTubeId(url);
	if (url === undefined) return { error: true };
	return {
		id: id,
		title: 'XD',
		duration: 18000,
		thumbnail: getYouTubeThumbnail(id),
	}
};
