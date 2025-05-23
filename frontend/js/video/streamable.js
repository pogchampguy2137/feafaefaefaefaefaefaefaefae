export const getStreamableSource = async (url) => {
	try {
		const id = getStreamableId(url);
		const data = await fetch('https://api.streamable.com/videos/' + id);
		const json = await data.json();
		return json.files.mp4.url;
	} catch (error) {
		console.warn("[streamplus-source] Coulnd't get Streamable source url", id);
	}
};

const getStreamableId = (url) => {
	try {
		const id = url.substring(url.lastIndexOf('/') + 1);
		return id.includes('?') ? id.substring(0, id.indexOf('?')) : id;
	} catch (error) {
		console.warn("[streamplus-source] Couldn't parse Streamable id", url);
	}
};
