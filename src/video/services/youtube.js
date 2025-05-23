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
	return new Promise((resolve) => {
		fetch(
			'https://yt.lemnoslife.com/noKey/videos?&fields=items(id,snippet(title),contentDetails(duration))&part=contentDetails,snippet&id=' +
				id
		)
			.then((response) => response.json())
			.then((json) => {
				const item = json.items[0];
				resolve({
					id: item.id,
					title: item.snippet.title,
					duration: Duration.fromISO(item.contentDetails.duration).toMillis() / 1000,
					thumbnail: getYouTubeThumbnail(item.id),
				});
			})
			.catch((error) => {
				Logger.warn("Couldn't get YouTube data", url, error);
				resolve({ error: true });
			});
	});
};
