import Logger from '../logger';
import { isYouTubeURL } from './services/youtube';

export const getVideoType = (url) => {
	try {
		const URLObject = new URL(url);
		const hostname = URLObject.hostname.toLowerCase();
		if (isYouTubeURL(url)) return 'youtube';
		else if (hostname.endsWith('streamable.com')) return 'streamable';
		else if (hostname.endsWith('tiktok.com')) return 'tiktok';
		else return 'video';
	} catch (error) {
		Logger.warn("Couldn't get video type", url);
	}
};
