import fs from 'fs';
import Logger from '../logger';
import { MEDIA } from '../constants';
import crypto from 'crypto';
import { getVideoType } from '../video/type';
import { getData } from '../video/data';
import { resetState, play } from './state';
import { broadcastMedia, broadcastQueue } from './users';
import { getChannel } from './channel';
import { getNextMedia, removeMediaById } from '../database/media';

const allowedTypes = ['video', 'youtube', 'streamable', 'tiktok', 'embed'];

let currentMedia;

if (!fs.existsSync('./data/')) fs.mkdirSync('./data/');
if (!fs.existsSync('./data/media.json')) fs.writeFileSync('./data/media.json', JSON.stringify(MEDIA, null, 4), 'utf-8');
currentMedia = JSON.parse(fs.readFileSync('./data/media.json', 'utf-8'));
Logger.info(
	`Loaded current video: ${currentMedia.title} @ [${currentMedia.type}] ${
		currentMedia.sourceList[currentMedia.defaultSource]
	} `
);

export const getMedia = () => currentMedia;

export const saveMedia = () => fs.writeFileSync('./data/media.json', JSON.stringify(currentMedia, null, 4), 'utf-8');

/*
 * Media has to include:
 * - sourceList, defaultSource, username, userId, userAvatar and addedAt
 */
export const formatMedia = async (media, isAdmin = false) => {
	if (media.sourceList < 1) return;
	const defaultSource = media.sourceList[media.defaultSource];
	if (media.type === undefined) {
		const type = getVideoType(defaultSource);
		if (!type) return;
		media.type = type;
	}
	if (!allowedTypes.includes(media.type)) return;

	media.isAdmin = isAdmin;
	const data = await getData(media.type, defaultSource);

	if (media.id === undefined) media.id = (data.id !== undefined ? data.id + ':' : '') + crypto.randomUUID();
	if (data?.source) {
		media.sourceList[media.defaultSource] = data.source;
	}
	if (media.syncable && data.error)
		return Logger.error("Error occurred when getting media data, so it can't be syncable");

	if (media.syncable || media.syncable === undefined) {
		if (media.duration === undefined && data.duration !== undefined) {
			if (data.duration < 1) media.syncable = false;
			else {
				media.duration = data.duration;
				media.syncable = true;
			}
		} else media.syncable = false;
	}
	if (!isAdmin && (!media.syncable || media.duration < 1)) return;

	if (media.url === undefined) media.url = data.url || defaultSource || '#';
	if (media.title === undefined) media.title = data.title || 'Unknown Title';
	if (media.description === undefined) media.description = data.description || '';
	if (media.thumbnail === undefined) media.thumbnail = data.thumbnail;

	return media;
};

export const playMedia = async (media, admin = false, format = false) => {
	if (format) media = await formatMedia(media, admin);
	if (!media) return;
	currentMedia = media;
	resetState(true);
	broadcastMedia();
	saveMedia();
	Logger.info(`Playing new media: [${media.type}] ${media.sourceList[media.defaultSource]} (User: ${media.userId})`);
	return true;
};

export const playNextMedia = () => {
	const nextMedia = getNextMedia();
	if (!nextMedia) return;
	const autoplay = getChannel().autoplay;
	removeMediaById(nextMedia.id);
	playMedia(nextMedia, false, false);
	Logger.info(`Playing new media: [${nextMedia.type}] ${nextMedia.id} ${autoplay ? ' [autoplay]' : ' '}`);
	broadcastQueue();
	if (autoplay) setTimeout(() => play(), 1000);
};
