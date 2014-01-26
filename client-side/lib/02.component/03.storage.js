var storage = {};
api.set = function(key, value) {
	storage[key] = value;
	return this;
};
api.get = function(key) {
	return storage[key];
};