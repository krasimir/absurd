var fs = require('fs');

module.exports = function() {

	var _api = {},
		_rules = {},
		_storage = {},
		_plugins = {};

	_api.getRules = function(stylesheet) {
		if(typeof stylesheet === 'undefined') {
			return _rules;
		} else {
			if(typeof _rules[stylesheet] === 'undefined') {
				_rules[stylesheet] = [];
			}
			return _rules[stylesheet];
		}
	}
	_api.getPlugins = function() {
		return _plugins;		
	}
	_api.getStorage = function() {
		return _storage;
	}
	_api.flush = function() {
		_rules = {};
		_storage = [];
	}

	// internal variables
	_api.numOfAddedRules = 0;

	// registering API methods
	if(fs.existsSync(__dirname + "/api")) {
		var methods = fs.readdirSync(__dirname + "/api");
		for(var i=0; i<methods.length; i++) {
			var file = methods[i];
			_api[file.replace(".js", "")] = require(__dirname + "/api/" + file)(_api);
		}
	}

	// adding plugins
	if(fs.existsSync(__dirname + "/plugins")) {
	    var plugins = fs.readdirSync(__dirname + "/plugins");
		for(var i=0; i<plugins.length; i++) {
			var file = plugins[i];
			_api.plugin(file.replace(".js", ""), require(__dirname + "/plugins/" + file)());
		}
	}	

	return _api;

}