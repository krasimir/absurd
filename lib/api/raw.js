module.exports = function(api) {
	return function(raw) {
		api.add({
			____raw: { value: raw }
		});
		return api;
	}
}