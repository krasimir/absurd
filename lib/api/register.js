module.exports = function(api) {
	return function(method, func) {
		api[method] = func;
		return api;
	}
}