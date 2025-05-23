import { getMedia, recieveLastMedia, recieveLastState } from '../../handler.js';
import { isWindowMuted } from '../../ui/volume.js';
import { getYouTubeId } from '../../video/youtube.js';
import { PAGE_URL } from '../../index.js';
import { formatType } from './type.js';

let videoPlayer;
let youtubePlayer;
let embedPlayer;

let isYouTubeReady = false;

const players = {
	youtube: {
		play: () => {
			if (youtubePlayer.getPlayerState() == 2) youtubePlayer.playVideo();
		},
		pause: () => {
			if (youtubePlayer.getPlayerState() == 1) youtubePlayer.pauseVideo();
		},
		setSource: (src) => {
			const id = getYouTubeId(src);
			if (id) youtubePlayer.loadVideoById(id);
		},
		getCurrentTime: () => {
			const player = youtubePlayer;
			if (player && player.getCurrentTime) {
				return player.getCurrentTime();
			}
		},
		seek: (currentTime) => youtubePlayer.seekTo(currentTime),
		getVolume: () => youtubePlayer.getVolume() / 100,
		setVolume: (volume) => youtubePlayer.setVolume(volume * 100),
		unmute: () => youtubePlayer.unMute(),
		isPaused: () => youtubePlayer.getPlayerState() == 2,
		getElement: () => youtubePlayer.getIframe(),
		hidePlayer: () => {
			if (youtubePlayer.loadVideoById) youtubePlayer.loadVideoById('-Pg819il8lY');
			if (youtubePlayer.pause) youtubePlayer.pause();
			youtubePlayer.getIframe().style.display = 'none';
		},
		isReady: () => isYouTubeReady,
	},
	video: {
		play: () => {
			if (videoPlayer.paused) videoPlayer.play();
		},
		pause: () => {
			if (!videoPlayer.paused) videoPlayer.pause();
		},
		setSource: (src) => (videoPlayer.src = src),
		getCurrentTime: () => videoPlayer.currentTime,
		seek: (currentTime) => (videoPlayer.currentTime = currentTime),
		getVolume: () => videoPlayer.volume,
		setVolume: (volume) => (videoPlayer.volume = volume),
		mute: () => (videoPlayer.muted = true),
		unmute: () => (videoPlayer.muted = false),
		isPaused: () => videoPlayer.paused,
		getElement: () => videoPlayer,
		hidePlayer: () => {
			videoPlayer.pause();
			videoPlayer.src = '';
			videoPlayer.style.display = 'none';
		},
		isReady: () => true,
	},
	embed: {
		setSource: (source) => (embedPlayer.src = source),
		getSource: () => embedPlayer.src,
		getElement: () => embedPlayer,
		hidePlayer: () => {
			embedPlayer.src = '';
			embedPlayer.style.display = 'none';
		},
		isReady: () => true,
	},
};

export const initialize = () => {
	videoPlayer = document.querySelector('.player > .player__video');
	embedPlayer = document.querySelector('.player > .player__embed');
	youtubePlayer = new YT.Player('player__youtube', {
		playerVars: {
			controls: 1,
			modestbranding: 1,
			fs: 0,
			origin: PAGE_URL,
			start: 0,
		},
		events: {
			onReady: (event) => {
				if (isWindowMuted()) event.target.mute();
				isYouTubeReady = true;
				recieveLastMedia();
			},
			onStateChange: (event) => {
				if (event.data === YT.PlayerState.PLAYING) {
					console.info('[streamplsu] [player-youtube] Ending buffering -> recieving last state');
					recieveLastState();
				}
			},
		},
	});

	let videoBuffering = false;
	videoPlayer.addEventListener('waiting', () => (videoBuffering = true));
	videoPlayer.addEventListener('playing', () => {
		if (videoBuffering) {
			console.info('[streamplsu] [player-video] Ending buffering -> recieving last state');
			videoBuffering = false;
			recieveLastState();
		}
	});

	hidePlayers();
};

export const hidePlayers = (muteAlso = false, expect) => {
	const allPlayers = Object.keys(players);
	allPlayers.forEach((player) => {
		if (expect !== player) {
			const mute = players[player].mute;
			if (mute && muteAlso) mute();
			players[player].hidePlayer();
		}
	});
};

export const getPlayer = (type) => players[type];
export const getCurrentPlayer = () => getPlayer(formatType(getMedia()?.type));
