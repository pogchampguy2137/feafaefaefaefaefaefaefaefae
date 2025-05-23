import Cache from '../cache.js';

let camera;
let playerContainer;
let maxX, maxY;

let pos1 = 0,
	pos2 = 0,
	pos3 = 0,
	pos4 = 0;

const position = Cache.get('ui:camera:position', { x: 0, y: 0 });

const updateDimensions = () => {
	maxX = window.innerWidth - 24;
	maxY = window.innerHeight - 24;
	updatePosition(position.x, position.y, false);
};

const handleCamera = (camera) => {
	updatePosition(position.x, position.y);

	const cameraDrag = camera.querySelector('.camera__drag');
	let holding = false;

	cameraDrag.addEventListener('mousedown', (event) => {
		pos3 = event.clientX;
		pos4 = event.clientY;
		document.body.classList.add('camera__block--drag');
		camera.classList.add('camera__active--drag');
		holding = true;
	});
	window.addEventListener('mouseup', () => {
		holding = false;
		document.body.classList.remove('camera__block--drag');
		camera.classList.remove('camera__active--drag');
	});

	document.addEventListener('mousemove', (event) => {
		if (!holding) return;
		pos1 = pos3 - event.clientX;
		pos2 = pos4 - event.clientY;
		pos3 = event.clientX;
		pos4 = event.clientY;

		const left = camera.offsetLeft - pos1;
		const top = camera.offsetTop - pos2;
		updatePosition(left, top);
	});
};

window.addEventListener('resize', updateDimensions);

document.addEventListener('DOMContentLoaded', () => {
	camera = document.querySelector('.camera');
	playerContainer = document.querySelector('.player');
	updateDimensions();
	handleCamera(camera);
});

let final;
const updatePosition = (x, y, save = true) => {
	const cameraWidth = camera.clientWidth;
	const cameraHeight = camera.clientHeight;

	if (x + cameraWidth > maxX) x = maxX - cameraWidth;
	if (y + cameraHeight > maxY) y = maxY - cameraHeight;
	if (x < 1) x = 0;
	if (y < 1) y = 0;

	camera.style.left = x + 'px';
	camera.style.top = y + 'px';

	if (!save) return;
	position.x = x;
	position.y = y;
	if (final) clearTimeout(final);
	final = setTimeout(() => {
		Cache.set('ui:camera:position', { x, y });
		clearInterval(final);
	}, 250);
};
