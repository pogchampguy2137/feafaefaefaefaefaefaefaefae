import { io } from 'socket.io-client';
import { recieveChannel, recieveMedia, recieveState } from './handler.js';
import { initializeBar } from './player/bar.js';
import { getInputMedia } from './input.js';

export let socket;
export let account;

window.addEventListener('DOMContentLoaded', () => {
	initializeBar();
	const auth = {adminToken: localStorage.getItem('adminToken') }
	if(!auth) {
		alert("Missing admin token");
		return;
	}
	socket = io(window.location.origin, {
		auth
	});

	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`);
	});

	socket.emit('admin:server:join');

	socket.on('user:login:success', (user) => {
		account = user;
	});

	socket.on('user:client:channel', (channel) => recieveChannel(channel));
	socket.on('user:client:media', (media) => recieveMedia(media));
	socket.on('user:client:state', (state) => recieveState(state));

	socket.on('admin:client:joined', () => console.info('[ADMIN] Joined as admin'));

	document.querySelector('#controls > #play').addEventListener('click', () => socket.emit('admin:server:play'));
	document.querySelector('#controls > #pause').addEventListener('click', () => socket.emit('admin:server:pause'));
	document.querySelector('#controls > #skip').addEventListener('click', () => socket.emit('admin:server:skip'));

	document.querySelector('#media > #play-now-button').addEventListener('click', () => {
		const newMedia = getInputMedia();
		if (newMedia) socket.emit('admin:server:playNow', newMedia);
	});
	document.querySelector('#media > #add-button').addEventListener('click', () => {
		const newMedia = getInputMedia();
		if (newMedia) socket.emit('admin:server:add', newMedia);
	});

	document.querySelector('#channel > button').addEventListener('click', () => {
		const username = document.querySelector('#channel-username').value;
		let latency = parseInt(document.querySelector('#channel-latency').value);
		if (username.length < 1) return;
		if (latency < 0) latency = 0;

		const channel = {
			username,
			latency,
			platform: document.querySelector('#channel-platform').value,
			latencyMode: document.querySelector('#channel-latency-mode').checked ? 'auto' : 'custom',
			sync: document.querySelector('#channel-sync').checked,
			autoplay: document.querySelector('#channel-autoplay').checked,
			mediaRequest: document.querySelector('#channel-request').checked,
		};
		socket.emit('admin:server:channel', channel);
	});

	document.querySelector('#raw-data').addEventListener('click', () => {
		let json = prompt('Paste data here');
		try {
			json = JSON.parse(json);
			if (json.title) document.querySelector('#media-title').value = json.title;
			if (json.description) document.querySelector('#media-description').value = json.description;
			if (json.url) document.querySelector('#media-url').value = json.url;
			if (json.thumbnail) document.querySelector('#media-thumbnail').value = json.thumbnail;
		} catch (error) {
			alert("Couldn't parse JSON data.");
		}
	});

	socket.on('admin:client:viewers', (viewers) => {
		console.log('[viewers] got new viewers', viewers);
		document.querySelector('#viewers-count').textContent = viewers.count;
		const list = document.querySelector('#viewers-list');
		list.innerHTML = '';
		viewers.users.forEach((viewer) => {
			const li = document.createElement('li');
			const link = document.createElement('a');
			link.target = '_blank';
			link.textContent = `${viewer.display_name} (${viewer.username})`;
			link.href = `https://discord.com/users/${viewer.id}`;
			link.style.color = 'white';
			li.appendChild(link);
			const span = document.createElement('span');
			span.textContent = ` - ${viewer.role}`;
			li.appendChild(span);
			list.appendChild(li);
		});
	});

	socket.emit('admin:server:viewers');
	document.querySelector('#refresh-viewers').addEventListener('click', () => {
		socket.emit('admin:server:viewers');
	});

	const sourceList = document.querySelector('#source-list');
	document.querySelector('#new-source-button').addEventListener('click', () => {
		const div = document.createElement('div');
		div.classList.add('source');
		div.innerHTML = `
            Name: <input class="name" type="text"/> Source: <input class="source" type="text" />
            <input type="radio" class="default" name="source-default" /> Default
        `;
		sourceList.appendChild(div);
	});
});

