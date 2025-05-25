import { account } from './index.js';

export const getSources = () => {
	const sourceList = document.querySelector('#source-list');
	const sources = {};
	let defaultSource = 'default';
	[...sourceList.children].forEach((child) => {
		const name = child.getElementsByClassName('name')[0].value;
		const source = child.getElementsByClassName('source')[0].value;
		if (name.length > 0 && source.length > 0) {
			sources[name] = source;
			if (child.getElementsByClassName('default')[0].checked) defaultSource = name;
		}
	});

	console.log(Object.keys(sources));
	console.log(Object.keys(sources).length);
	if (Object.keys(sources).length > 0) {
		console.log('removing');
		sourceList.innerHTML = `
            <div class="source">
                Name: <input class="name" type="text" value="default" /> Source: <input class="source" type="text" />
                <input type="radio" class="default" name="source-default" checked /> Default
            </div>
        `;
	}

	return { sourceList: sources, defaultSource };
};

export const getInputMedia = () => {
	const { sourceList, defaultSource } = getSources();
	console.log(sourceList, defaultSource);
	if (Object.keys(sourceList).length < 1) {
		alert('Source List is empty.');
		return;
	}
	const newMedia = {
		sourceList,
		defaultSource,
		username: 'ADMIN',
		userId: 0,
		userAvatar: 'https://i.ytimg.com/vi/hY7m5jjJ9mM/hqdefault.jpg',
		addedAt: Date.now(),
	};
	if (document.querySelector('#media > #media-embed').checked) newMedia.type = 'embed';
	if (document.querySelector('#media > #media-title').value.length > 0)
		newMedia.title = document.querySelector('#media > #media-title').value;

	if (document.querySelector('#media > #media-description').value.length > 0)
		newMedia.description = document.querySelector('#media > #media-description').value;

	if (document.querySelector('#media > #media-url').value.length > 0)
		newMedia.url = document.querySelector('#media > #media-url').value;

	if (document.querySelector('#media > #media-thumbnail').value.length > 0)
		newMedia.thumbnail = document.querySelector('#media > #media-thumbnail').value;

	document.querySelector('#media > #media-title').value = '';
	document.querySelector('#media > #media-description').value = '';
	document.querySelector('#media > #media-url').value = '';
	document.querySelector('#media > #media-thumbnail').value = '';
	document.querySelector('#media > #media-embed').checked = false;
	return newMedia;
};
