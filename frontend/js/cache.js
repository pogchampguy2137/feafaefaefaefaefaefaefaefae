let cache = {};

const tempCache = localStorage.getItem('__cache');
if (tempCache) cache = JSON.parse(tempCache);

const updates = [];

const get = (key, defaultValue) => {
	if (cache[key] === undefined) return defaultValue;
	else return cache[key];
};

const set = (key, value) => {
	cache[key] = value;
	localStorage.setItem('__cache', JSON.stringify(cache));
	const keyUpdates = updates.filter((update) => update.key === key);
	keyUpdates.forEach((update) => update.callback(value));
	console.info('[cache]', key, '->', value);
};

const update = (key, callback) => updates.push({ key, callback });

const Cache = { get, set, update };

export default Cache;
