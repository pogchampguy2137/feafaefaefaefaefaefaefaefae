import { getVideoDurationInSeconds } from 'get-video-duration';
import Logger from '../../logger';

const getFileName = (url) => {
	try {
		return url.split('/').pop().split('#')[0].split('?')[0];
	} catch (error) {}
};

export const getVideoData = (url) => {
		return {
	title: getFileName(url) || 'unknown file',
		duration: 9999999999999999999999999999999999,
	}
};
