import { convertSeconds } from '../ui/bar.js';
import { getMedia } from '../handler.js';

let queueSize;
let queueDuration;
let mediaList;

export const handleQueue = (socket) => {
	queueSize = document.querySelector('#queue__size');
	queueDuration = document.querySelector('#queue__duration');
	mediaList = document.querySelector('.media');

	socket.on('user:client:queue:all', renderVideos);
};

const renderVideos = (videos) => {
	mediaList.children;
	const medias = [...mediaList.querySelectorAll('.media__item')].filter(
		(media) => !media.classList.contains('media--current')
	);
	medias.forEach((media) => media.remove());

	let duration = getMedia()?.duration ?? 0;
	let videoPosition = 1;
	videos.forEach((video) => {
		const item = document.createElement('div');
		item.classList.add('media__item');

		const position = document.createElement('div');
		position.classList.add('media__position');
		position.textContent = videoPosition++;
		item.appendChild(position);

		const info = document.createElement('div');
		info.classList.add('media__info');

		const imageLink = document.createElement('a');
		imageLink.classList.add('media__link');
		imageLink.target = '_blank';
		imageLink.href = video.url || '#';
		const image = document.createElement('div');
		image.classList.add('media__image');
		if (video.duration) {
			duration += video.duration;
			const mediaDuration = document.createElement('div');
			mediaDuration.classList.add('media__duration');
			mediaDuration.textContent = convertSeconds(video.duration);
			image.appendChild(mediaDuration);
		}
		const img = document.createElement('img');
		img.classList.add('media__image');
		img.src = video.thumbnail || './img/media/thumbnail.png';
		image.appendChild(img);
		imageLink.appendChild(image);
		info.appendChild(imageLink);

		const text = document.createElement('div');
		text.classList.add('media__text');
		const header = document.createElement('div');
		header.classList.add('media__text--header');
		const titleLink = document.createElement('a');
		titleLink.classList.add('media__link');
		titleLink.target = '_blank';
		titleLink.href = video.url || '#';
		const title = document.createElement('div');
		title.classList.add('media__text--title');
		title.textContent = video.title;
		title.title = video.title;
		titleLink.appendChild(title);
		header.appendChild(titleLink);
		const description = document.createElement('div');
		description.classList.add('media__text--description');
		description.textContent = video.description || '';
		header.appendChild(description);
		text.appendChild(header);
		const footer = document.createElement('div');
		footer.classList.add('media__text--footer');
		const avatar = document.createElement('img');
		avatar.classList.add('media__avatar');
		avatar.src = video.userAvatar || './img/media/avatar.png';
		footer.appendChild(avatar);
		const username = document.createElement('div');
		username.classList.add('media--text--username');
		username.textContent = video.username || 'unknown user';
		footer.appendChild(username);
		footer.title = `Added by: ${video.username || 'unknown user'}`;
		text.appendChild(footer);
		info.appendChild(text);
		item.appendChild(info);

		mediaList.appendChild(item);
	});
	queueSize.textContent = videos.length + 1;
	queueDuration.textContent = convertSeconds(duration);
};
