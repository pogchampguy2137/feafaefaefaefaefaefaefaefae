import { setBarDuration } from '../player/bar.js';

export const handleMedia = (media) => {
	if (media.syncable) {
		document.querySelector('#bar').removeAttribute('disabled');
		setBarDuration(media.duration);
	} else document.querySelector('#bar').setAttribute('disabled', '');
};
