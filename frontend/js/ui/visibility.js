import Cache from '../cache.js';

window.addEventListener('DOMContentLoaded', () => {
	const cameraVisible = Cache.get('ui:camera:visible', true);
	const camera = document.querySelector('.camera');
	camera.style.display = cameraVisible ? 'block' : 'none';
	Cache.update('ui:camera:visible', (value) => {
		camera.style.display = value ? 'block' : 'none';
	});

	const chatVisible = Cache.get('ui:chat:visible', true);
	const chat = document.querySelector('.chat');
	chat.style.display = chatVisible ? 'block' : 'none';
	Cache.update('ui:chat:visible', (value) => {
		chat.style.display = value ? 'block' : 'none';
	});
});
