import Cache from '../cache.js';

document.addEventListener('DOMContentLoaded', () => {
	handleCamera(document.querySelector('.camera'));
	handleChat(document.querySelector('.chat'));
});

const handleCamera = (camera) => {
	camera.style.width = Cache.get('ui:camera:width', 340) + 'px';

	const cameraReSize = camera.querySelector('.camera__resize');
	let holding = false;
	let hovering = false;

	cameraReSize.addEventListener('mousedown', () => {
		holding = true;
		document.body.classList.add('camera__block--resize');
	});
	document.addEventListener('mouseup', () => {
		holding = false;
		document.body.classList.remove('camera__block--resize');
		if (!hovering) camera.classList.remove('camera__active--resize');
	});

	camera.addEventListener('mouseenter', () => {
		hovering = true;
		camera.classList.add('camera__active--resize');
	});
	camera.addEventListener('mouseleave', () => {
		hovering = false;
		if (holding) return;
		camera.classList.remove('camera__active--resize');
	});

	let final;
	document.addEventListener('mousemove', (event) => {
		if (!holding) return;
		const newWidth = event.pageX - camera.getBoundingClientRect().left;
		camera.style.width = newWidth + 'px';

		if (final) clearTimeout(final);
		final = setTimeout(() => {
			Cache.set('ui:camera:width', newWidth);
			clearInterval(final);
		}, 250);
	});
};

const handleChat = (chat) => {
	let chatWidth = Cache.get('ui:chat:width', 320);
	chat.style.width = chatWidth + 'px';

	const chatReSize = chat.querySelector('.chat__resize');

	let holding = false;
	let hovering = false;

	chatReSize.addEventListener('mousedown', () => {
		holding = true;
	});
	document.addEventListener('mouseup', () => {
		holding = false;
		if (!hovering) chat.classList.remove('chat--active');
	});

	chatReSize.addEventListener('mouseenter', () => {
		hovering = true;
		chat.classList.add('chat--active');
	});
	chatReSize.addEventListener('mouseleave', () => {
		hovering = false;
		if (holding) return;
		chat.classList.remove('chat--active');
	});

	let final;
	window.addEventListener('mousemove', (event) => {
		if (!holding) return;
		let newWidth = chatWidth - (event.pageX - chat.getBoundingClientRect().left);
		if (newWidth > 720) newWidth = 720;
		if (newWidth < 240) newWidth = 240;

		chat.style.width = newWidth + 'px';
		chatWidth = newWidth;

		if (final) clearTimeout(final);
		final = setTimeout(() => {
			Cache.set('ui:chat:width', newWidth);
			clearInterval(final);
		}, 250);
	});
};
