export const getYouTubeId = (url) => {
	const regex =
		/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	const matches = url.match(regex);
	if (!matches) return;
	if (matches.length > 1) return matches[1];
	return id;
};
