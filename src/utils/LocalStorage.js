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

export function cache(name, asyncMethod, reFetch = true) {
	return (async () => {
		let data;
		if (getItem(`Cache::${name}`)) {
			data = getCacheItem(name);
			if (reFetch) {
				(async () => setCacheItem(name, await asyncMethod()))();
			}
		} else {
			setCacheItem(name, data = await asyncMethod());
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