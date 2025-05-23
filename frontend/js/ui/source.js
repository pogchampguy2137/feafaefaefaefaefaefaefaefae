import { getMedia } from '../handler.js';
import { recieveLastMedia } from '../handler.js';
import Cache from '../cache.js';

let opened = false;

const sourceButton = document.querySelector('#source-button');
const sources = document.querySelector('.controls__source > select');

export const toggleSources = () => {
	opened = !opened;
	return opened;
};

export const handleSources = (id, sourceList, deafultMediaSource) => {
	const keys = Object.keys(sourceList);
	if (keys.length < 2) {
		sourceButton.style.display = 'none';
		return;
	}
	sources.innerHTML = '';

	let defaultSource = deafultMediaSource;
	const savedSource = Cache.get('ui:player:source', { id: -1, source: 'default' });
	if (savedSource.id === id) {
		defaultSource = savedSource.source;
		console.info('[streamplus-sources] Loaded deafult source from cache', defaultSource);
	}

	keys.forEach((source) => {
		const option = document.createElement('option');
		option.value = source;
		option.textContent = source;
		sources.appendChild(option);
	});
	sources.value = defaultSource;

	sourceButton.style.display = 'flex';
};

window.addEventListener('DOMContentLoaded', () => {
	sources.addEventListener('change', async () => {
		console.info('[streamplus-sources] Changed source to', sources.value);
		Cache.set('ui:player:source', {
			id: getMedia().id || -1,
			source: sources.value,
		});
		recieveLastMedia(true);
		console.info('[streamplus-sources] Refreshing current media');
	});
});
