import Logger from '../../logger';

export const getStreamableId = (url) => {
	try {
		const id = url.substring(url.lastIndexOf('/') + 1);
		return id.includes('?') ? id.substring(0, id.indexOf('?')) : id;
	} catch (error) {
		Logger.warn("Couldn't parse Streamable id", url);
	}
};

export const getStreamableData = (url) => {
	const id = getStreamableId(url);
	return new Promise(async (resolve) => {
		fetch('https://api.streamable.com/videos/' + id)
			.then((response) => response.json())
			.then((json) => {
				resolve({
					id,
					title: json.title,
					duration: json.files.mp4.duration,
					thumbnail: `https://cdn-cf-east.streamable.com/image/${id}.jpg`,
				});
			})
			.catch((error) => {
				Logger.warn('Error when getting streamable duration', url, error);
				resolve({ error: true });
			});
	});
};
