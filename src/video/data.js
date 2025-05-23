import { getVideoData } from './services/video';
import { getYouTubeData } from './services/youtube';
import { getStreamableData } from './services/streamable';
import { getTikTokData } from './services/tiktok';

const datas = {
	video: getVideoData,
	youtube: getYouTubeData,
	streamable: getStreamableData,
	tiktok: getTikTokData,
};

export const getData = (type, url) => {
	const data = datas[type];
	if (!data) return { error: true };
	else return data(url);
};
