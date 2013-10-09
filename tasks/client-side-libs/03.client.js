var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

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

		/******************************************* Copied directly from /lib/API.js */

		// registering api methods
		for(var method in lib.api) {
			_api[method] = lib.api[method](_api);
		}

		// registering plugins
		for(var pluginName in lib.plugins) {
			_api.plugin(pluginName, lib.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		// client side specific methods 
		_api.compile = function(callback) {
			lib.Processor(
				_api.getRules(),
				callback || function() {},
				{}
			);
		}

		return _api;

	}
}