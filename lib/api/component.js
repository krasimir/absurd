module.exports = function(api) {
	return function(name, done) {
		api.getComponents()[name] = {};
	}
}