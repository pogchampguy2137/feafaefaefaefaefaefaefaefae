const CHANNEL = {
	username: 'thevoid',
	platform: 'twitch',
	latency: 0,
	latencyMode: 'auto',
	sync: false,
	autoplay: false,
	mediaRequest: false,
};

const MEDIA = {
	id: 'big-buck-bunny',
	sourceList: {
		default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
	},
	defaultSource: 'default',
	type: 'video',
	duration: 596.474195,
	title: 'Big Buck Bunny',
	description: 'Video of Big Buck Bunny',
	thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
	username: 'SERVER',
	userId: 0,
	addedAt: 1,
	url: '#',
	syncable: true,
};

const STATE = {
	timeWatched: 0,
	timestamp: -1,
	paused: true,
};

export { CHANNEL, MEDIA, STATE };
