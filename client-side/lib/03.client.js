var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (hasOwnProperty.call(source, key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		};

		var _api = {},
			_rules = {},
			_storage = {},
			_plugins = {},
			_defaultOptions = {
				combineSelectors: true,
				minify: false,
				processor: lib.processors.CSS()
			};

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

		// client side specific methods 
		_api.compile = function(callback, options) {
			options = extend(_defaultOptions, options || {});
			options.processor(
				_api.getRules(),
				callback || function() {},
				{combineSelectors: true}
			);
		}
		_api.getPath = function() {
			return {};
		}

		// registering api methods
		for(var method in lib.api) {
			if(method !== "compile") {
				_api[method] = lib.api[method](_api);
			}
		}

		// registering plugins
		for(var pluginName in lib.plugins) {
			_api.plugin(pluginName, lib.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		return _api;

	}
}