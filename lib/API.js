var fs = require('fs');
var path = require("path");

module.exports = function() {

	var _api = {},
		_rules = {},
		_storage = {},
		_plugins = {},
		_hooks = {};

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

	// Handling CSS
	_api.handlecss = function(parsed, path) {
		var plugins = _api.getPlugins();
		if(parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
			var rules = parsed.stylesheet.rules;
			for(var i=0; rule=rules[i]; i++) {
				switch(rule.type) {
					case "rule": _api.handlecssrule(rule); break;
					case "import": _api.handlecssimport(rule, path); break;
					default:
						if(plugins[rule.type]) {
							plugins[rule.type](_api, rule);
						}
					break;
				}
			}
		}
		return _api;
	}
	_api.handlecssimport = function(rule, cssPath) {
		_api.import(path.dirname(cssPath) + "/" + rule.import.replace(/"/g, ''));
		return _api;
	}
	_api.handlecssrule = function(rule, stylesheet) {
		var absurdObj = {}, absurdProps = {};
		if(rule.declarations && rule.declarations.length > 0) {
			for(var i=0; decl=rule.declarations[i]; i++) {
				if(decl.type === "declaration") {
					absurdProps[decl.property] = decl.value;
				}
			}
			if(rule.selectors && rule.selectors.length > 0) {
				for(var i=0; selector=rule.selectors[i]; i++) {
					absurdObj[selector] = absurdProps;
				}
			}
			_api.add(absurdObj, stylesheet);
		}
		return _api;
	}

	// hooks
	_api.addHook = function(method, callback) {
		if(!_hooks[method]) _hooks[method] = [];
		var isAlreadyAdded = false;
		for(var i=0; c=_hooks[method][i]; i++) {
			if(c === callback) {
				isAlreadyAdded = true;
			}
		}
		isAlreadyAdded === false ? _hooks[method].push(callback) : null;
	}
	_api.callHooks = function(method, args) {
		if(_hooks[method]) {
			for(var i=0; c=_hooks[method][i]; i++) {
				if(c.apply(_api, args) === true) return true;
			}
		}
		return false;
	}

	// internal variables
	_api.numOfAddedRules = 0;

	// registering API methods
	if(fs.existsSync(__dirname + "/api")) {
		var methods = fs.readdirSync(__dirname + "/api");
		for(var i=0; i<methods.length; i++) {
			var file = methods[i];
			_api[file.replace(".js", "")] = (function(file) {
				return function() {
					var f = require(__dirname + "/api/" + file)(_api);
					if(_api.callHooks(file.replace(".js", ""), arguments)) return _api;
					return f.apply(api, arguments);
				}
			})(file);			
		}
	}

	// adding plugins
	if(fs.existsSync(__dirname + "/processors/css/plugins")) {
	    var plugins = fs.readdirSync(__dirname + "/processors/css/plugins");
		for(var i=0; i<plugins.length; i++) {
			var file = plugins[i];
			_api.plugin(file.replace(".js", ""), require(__dirname + "/processors/css/plugins/" + file)());
		}
	}	

	return _api;

}