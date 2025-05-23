import { getPlayer, hidePlayers } from './player/players.js';
import { formatType } from './player/type.js';
import { getVolume, isWindowMuted } from '../ui/volume.js';
import { convertSeconds } from '../ui/bar.js';
import { getSource } from './player/source.js';
import { getChannel } from '../handler.js';
import { handleSources } from '../ui/source.js';
import Cache from '../cache.js';

export const handleMedia = async (media, sourceRefresh = false) => {
	handleMediaInfo(media);

	const formattedType = formatType(media?.type);
	const player = getPlayer(formattedType);
	if (!player) return;
	if (!player.isReady()) return;
	document.title = getChannel()?.username + ' — ' + media.title;

	if (player.getElement().getAttribute('media-id') !== media.id || sourceRefresh) {
		player.getElement().setAttribute('media-id', media.id);
		let source = media.source || media.sourceList[media.defaultSource];
		const savedSource = Cache.get('ui:player:source', { id: -1, source: 'default' });
		if (savedSource.id === media.id) {
			source = media.sourceList[savedSource.source];
			console.info('[streamplus-sources] Loaded deafult source from cache (directly to player)', source);
		}
		source = await getSource(source, media.type);
		player.setSource(source);
		console.info('[streamplus-player] [source]', source);
		hidePlayers(false, formattedType);
	}
	if (player.getElement().style.display === 'none' || player.getElement().style.display === '') {
		player.getElement().style.display = 'block';
	}

	if (media.syncable) {
		if (!sourceRefresh) handleSources(media.id, media.sourceList, media.defaultSource);
		if (!isWindowMuted()) {
			player.unmute();
			player.setVolume(getVolume());
		}
		document.querySelector('.player').classList.remove('not-syncable');
	} else document.querySelector('.player').classList.add('not-syncable');
};

const handleMediaInfo = (media) => {
	const mediaTitle = document.querySelector('#media__curent--title');
	const mediaDescription = document.querySelector('#media__curent--description');
	const mediaUser = document.querySelector('#media__curent--username');
	const mediaUserAvatar = document.querySelector('#media__curent--avatar');
	const mediaDuration = document.querySelector('#media__curent--duration');
	const mediaThumbnail = document.querySelector('#media__curent--thumbnail');

	let title = media?.title || 'Unknown Title';
	mediaTitle.title = title;

	mediaTitle.textContent = title;
	mediaDescription.textContent = media?.description || '';
	mediaUser.textContent = media?.username || 'unknown user';
	mediaUserAvatar.src = media?.userAvatar || './img/media/avatar.png';
	mediaDuration.textContent = convertSeconds(media?.duration ?? 0);
	mediaThumbnail.src = media?.thumbnail || './img/media/thumbnail.png';
	document.querySelector('#media__curent--footer').title = `Added by: ${media?.username || 'unknown user'}`;

	console.log('[current]', media?.url || '#');
	document.querySelectorAll('.media--current .media__link').forEach((link) => (link.href = media?.url || '#'));
};
