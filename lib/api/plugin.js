module.exports = function(api) {
	var plugin = function(name, func) {
		api.getPlugins()[name] = func;
		return api;
	}
	return plugin;	
}