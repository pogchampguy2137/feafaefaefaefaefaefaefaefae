import { getVideoDurationInSeconds } from 'get-video-duration';
import Logger from '../../logger';

const getFileName = (url) => {
	try {
		return url.split('/').pop().split('#')[0].split('?')[0];
	} catch (error) {}
};

export const getVideoData = (url) => {
	return new Promise((resolve) => {
		getVideoDurationInSeconds(url)
			.then((duration) => {
				resolve({
					title: getFileName(url) || 'unknown file',
					duration,
				});
			})
			.catch((error) => {
				Logger.warn('Error when getting video duration', url, error);
				resolve({ error: true });
			});
	});
};
