var fs = require('fs');

module.exports = function() {

	var _api = {},
		_rules = [],
		_storage = {},
		_plugins = {};

	_api.getRules = function() {
		return _rules;		
	}
	_api.getPlugins = function() {
		return _plugins;		
	}
	_api.getStorage = function() {
		return _storage;
	}
	_api.flush = function() {
		_rules = [];
		_storage = [];
	}

	// registering API methods
	var methods = fs.readdirSync(__dirname + "/api");
	for(var i=0; i<methods.length; i++) {
		var file = methods[i];
		_api[file.replace(".js", "")] = require(__dirname + "/api/" + file)(_api);
	}

	return _api;

}