var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		};

		var _api = { 
				defaultProcessor: lib.processors.css.CSS() 
			},
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
			_hooks = {};
			_api.defaultProcessor = lib.processors.css.CSS();
			return _api;
		}
		_api['import'] = function() { 
			if(_api.callHooks("import", arguments)) return _api;
			return _api; 
		}
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
				// absurdObj[rule.selectors.join(", ")] = absurdProps;
				if(rule.selectors && rule.selectors.length > 0) {
					for(var i=0; selector=rule.selectors[i]; i++) {
						absurdObj[selector] = extend({}, absurdProps);
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

		// absurd.components API
		_api.components = (function(api) {
			var extend = lib.helpers.Extend,
				clone = lib.helpers.Clone,
				comps = {}, 
				instances = [],
				events = extend({}, Component()),
				exports = {};

			(function(fn) {
				if(!window) return;
				if (window.addEventListener) {
					window.addEventListener('load', fn);
				} else if(window.attachEvent) {
					window.attachEvent('onload', fn);
				}
			})(function() {
				exports.broadcast("ready");
			})

			return exports = {
				numOfComponents: 0,
				events: events,
				register: function(name, cls) {
					this.numOfComponents += 1;
					return comps[name] = function() {
						var c = extend({}, Component(name, api, events, clone(cls)));
						api.di.resolveObject(c);
						instances.push(c);
						if(typeof c.constructor === 'function') {
							c.constructor.apply(c, Array.prototype.slice.call(arguments, 0));
						}
						return c;
					};
				},
				get: function(name) {
					if(comps[name]) { return comps[name]; }
					else { throw new Error("There is no component with name '" + name + "'."); }
				},
				remove: function(name) {
					if(comps[name]) { delete comps[name]; return true; }
					return false;
				},
				list: function() {
					var l = [];
					for(var name in comps) l.push(name);
					return l;
				},
				flush: function() {
					comps = {};
					instances = [];
					return this;
				},
				broadcast: function(event, data) {
					for(var i=0; i<instances.length, instance=instances[i]; i++) {
						if(typeof instance[event] === 'function') {
							instance[event](data);
						}
					}
					return this;
				}
			}
		})(_api);

		// absurd.component shortcut
		_api.component = (function(api) {
			return function(name, cls) {
				if(typeof cls == 'undefined') {
					return api.components.get(name);
				} else {
					return api.components.register(name, cls);
				}
			}
		})(_api);

		// dependency injector
		_api.di = lib.DI(_api);
		injecting(_api);

		/******************************************* Copied directly from /lib/API.js */

		// client side specific methods 
		_api.compile = function(callback, options) {
			if(_api.callHooks("compile", arguments)) return _api;
			var defaultOptions = {
				combineSelectors: true,
				minify: false,
				processor: _api.defaultProcessor,
				keepCamelCase: false,
				api: _api
			};
			options = extend(defaultOptions, options || {});
			var res = options.processor(
				_api.getRules(),
				callback || function() {},
				options
			);
			_api.flush();
			return res;
		}

		// registering api methods
		for(var method in lib.api) {
			if(method !== "compile") {
				_api[method] = lib.api[method](_api);
				_api[method] = (function(method) {
					return function() {
						var f = lib.api[method](_api);
						if(_api.callHooks(method, arguments)) return _api;
						return f.apply(_api, arguments);
					}
				})(method);		
			}
		}

		// registering plugins
		for(var pluginName in lib.processors.css.plugins) {
			_api.plugin(pluginName, lib.processors.css.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		// check for Organic
		if(typeof Organic != 'undefined') {
			Organic.init(_api);
		}

		// attaching utils functions
		_api.utils = {
			str2DOMElement: str2DOMElement
		}

		return _api;

	}
};