import { PAGE_URL } from '../index.js';
import { recieveLastState } from '../handler.js';

const camera = document.querySelector('.camera');
const chat = document.querySelector('.chat > iframe');

const requestStatusIcon = document.querySelector('.queue__status > img');
const requestButton = document.querySelector('#request-video-button');

let oldUsername, oldPlatform;
export let cameraPlayer;

const cameraPlatforms = {
	twitch: (username) => {
		document.querySelector('#camera__source').style.display = 'none';
		cameraPlayer = new Twitch.Player('camera', {
			channel: username,
			height: '100%',
			parent: [PAGE_URL],
			muted: true,
			autoplay: true,
		});
		cameraPlayer._iframe.id = 'camera__twitch';
	},
	kick: (username) => {
		camera.querySelector('iframe').src = `https://player.kick.com/${username}`;
	},
};

const chatPlatforms = {
	twitch: (username) => {
        let kickFix = (chat.contentDocument || chat.contentWindow.document);
        kickFix.body.innerHTML = '';
		chat.src = `https://www.twitch.tv/embed/${username}/chat?darkpopout&parent=${PAGE_URL}`;
	},
	kick: (username) => {
        let kickFix = (chat.contentDocument || chat.contentWindow.document);
        kickFix.body.innerHTML
        const embedChat = document.createElement('a');
        embedChat.href = '#';
        embedChat.target = '_top';
        embedChat.textContent = 'Open chat in new window';
        embedChat.style = `
            display: flex;
            width:  100%;
            height: 100%;
            color:  white;
            font-size:  24px;
            justify-content: center;
            align-items: center;`
        embedChat.onclick = () => {
            window.open(`https://kick.com/${username}/chatroom`, '_blank', 'location=yes,height=1500px,width=320,scrollbars=yes,status=yes')
        }
        kickFix.body.appendChild(embedChat);	
    },
};

export const handleChannel = (channel) => {
	if (channel.username !== oldUsername || channel.platform !== oldPlatform) {
		console.info('[streamplus-camera] Found new camera');
		camera.querySelector('#camera__source').style.display = 'block';
		camera.querySelector('#camera__twitch')?.remove();

		cameraPlatforms[channel.platform](channel.username);
		chatPlatforms[channel.platform](channel.username);
	}
	oldUsername = channel.username;
	oldPlatform = channel.platform;

	// const cameraURL = `https://player.twitch.tv/?channel=${channel.username}&autoplay=true&muted=true&parent=${PAGE_URL}`;
	// if (camera.src !== cameraURL) camera.src = cameraURL;
	// const chatURL = `https://www.twitch.tv/embed/${channel.username}/chat?darkpopout&parent=${PAGE_URL}`;
	// if (chat.src !== chatURL) chat.src = chatURL;

	const player = document.querySelector('.player');
	if (channel.sync) player.classList.remove('not-syncable-channel');
	else player.classList.add('not-syncable-channel');

	if (channel.mediaRequest) {
		requestStatusIcon.src = './img/queue/unlocked.svg';
		requestButton.removeAttribute('disabled');
		requestButton.title = '';
	} else {
		requestStatusIcon.src = './img/queue/locked.svg';
		requestButton.setAttribute('disabled', '');
		requestButton.title = 'Queue is currenlty locked.';
	}

	recieveLastState(); // Latency
};
