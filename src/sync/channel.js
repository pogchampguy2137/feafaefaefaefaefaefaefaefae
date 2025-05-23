import fs from 'fs';
import Logger from '../logger';
import { CHANNEL } from '../constants';
import { broadcastChannel } from './users';

let currentChannel;

if (!fs.existsSync('./data/')) fs.mkdirSync('./data/');
if (!fs.existsSync('./data/channel.json'))
	fs.writeFileSync('./data/channel.json', JSON.stringify(CHANNEL, null, 4), 'utf-8');
currentChannel = JSON.parse(fs.readFileSync('./data/channel.json', 'utf-8'));
Logger.info(`Loaded current channel: ${currentChannel.username} @ ${currentChannel.platform}`);

export const getChannel = () => currentChannel;
export const setChannel = (channel) => {
	currentChannel = channel;
	saveChannel();
	broadcastChannel();
};

export const saveChannel = () =>
	fs.writeFileSync('./data/channel.json', JSON.stringify(currentChannel, null, 4), 'utf-8');
