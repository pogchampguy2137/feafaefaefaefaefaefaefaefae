const videoTypes = ['streamable', 'tiktok'];

export const formatType = (type) => {
	if (videoTypes.includes(type)) return 'video';
	else return type;
};
