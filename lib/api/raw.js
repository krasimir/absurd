module.exports = function(api) {
	return function(raw) {
		var o = {};
		o["____raw_" + api.numOfAddedRules] = { value: raw };
		api.add(o);
		return api;
	}
}