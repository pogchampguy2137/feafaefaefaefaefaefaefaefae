import Logger from '../../logger';
import { getVideoDurationInSeconds } from 'get-video-duration';

export const getRedirectURL = async (url) => {
	try {
		const URLObject = new URL(url);
		const hostname = URLObject.hostname.toLowerCase();
		if (hostname.toLowerCase() === 'vm.tiktok.com' || hostname === 'vt.tiktok.com') {
			const redirect = await fetch(url, {
				redirect: 'follow',
				follow: 10,
			});
			return redirect.url;
		} else return url;
	} catch (error) {
		Logger.warn("Coulnd't get TikTok redirect URL");
	}
};

export const getTikTokData = async (url) => {
	url = await getRedirectURL(url);
	if (!url) return { error: true };
	const id = getVideoID(url);
	if (!id) return { error: true };
	return new Promise((resolve) => {
		fetch('https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=' + id)
			.then((response) => response.json())
			.then(async (json) => {
				const item = json.aweme_list[0];
				if (!item) return resolve({ error: true });
				const urlList = item.video.download_addr.url_list;
				if (urlList.length < 1) return resolve({ error: true });
				const source = urlList[urlList.length - 1];
				const duration = await getVideoDurationInSeconds(source);
				resolve({
					id,
					title: item.desc,
					duration,
					source,
					url,
				});
			})
			.catch((error) => {
				Logger.warn('Error when getting TikTOk duration', url, error);
				resolve({ error: true });
			});
	});
};

const getVideoID = (url) => {
	if (!url.includes('/video/')) return;
	const id = url.substring(url.indexOf('video') + 6, url.length);
	return id.length > 19 ? id.substring(0, id.indexOf('?')) : id;
};
