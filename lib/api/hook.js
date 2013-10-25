module.exports = function(api) {
	return function(method, callback) {
		api.addHook(method, callback);
		return api;
	}
}