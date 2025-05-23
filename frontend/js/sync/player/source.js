import { getStreamableSource } from '../../video/streamable.js';

const sources = {
	streamable: getStreamableSource,
};

export const getSource = async (url, type) => {
	const source = sources[type];
	if (source) {
		const sourceURL = await source(url);
		console.info(`[streamplus-source] [${type}] ${url} -> ${sourceURL}`);
		return sourceURL;
	} else return url;
};
