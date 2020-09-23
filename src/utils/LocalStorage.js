let BaseStorage = localStorage;

export function getItem(name) {
	return JSON.parse(BaseStorage.getItem(name));
}

export function setItem(name, data) {
	BaseStorage.setItem(name, JSON.stringify(data));
}

export function removeItem(name) {
	BaseStorage.removeItem(name);
}

export function getCacheItem(name) {
	return getItem(`Cache::${name}`)?.data;
}

export function setCacheItem(name, data) {
	setItem(`Cache::${name}`, {
		data,
		date: Date.now(),
	});
}

export function removeCacheItem(name) {
	removeItem(`Cache::${name}`);
}

export function cache(name, asyncData) {
	return (async () => {
		let data;
		if (getItem(`Cache::${name}`)) {
			data = getCacheItem(name);
			(async () => setCacheItem(name, await asyncData))();
		} else {
			setCacheItem(name, data = await asyncData);
		}
		return data;
	})();
}

export default {
	getItem,
	setItem,
	removeItem,
	getCacheItem,
	setCacheItem,
	removeCacheItem,
	cache,
};