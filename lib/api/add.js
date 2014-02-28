module.exports = function(API) {
	var extend = require("../helpers/Extend"),
		prefixes = require("../helpers/Prefixes"),
		toRegister = [],
		options = {
			combineSelectors: true
		};

	var checkAndExecutePlugin = function(selector, prop, value, stylesheet, parentSelector) {
		var prefix = prefixes.nonPrefixProp(prop);
		var plugin = API.getPlugins()[prefix.prop];
		// console.log("\nChecking for plugin: " + prefix.prop + " (" + prop + ")");
		if(typeof plugin !== 'undefined') {
			var pluginResponse = plugin(API, value, prefix.prefix);
			if(pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		// console.log("\n---------- addRule ---------", parentSelector + ' >>> ' + selector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		// catching null values
		if(props === null || typeof props === 'undefined' || props === false) return;
		if(!parentSelector && !selector) selector = '';

		// multiple selectors
		if(/, ?/g.test(selector) && options.combineSelectors) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);	
			}
			return;
		}

		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;	
		}

		// if array is passed
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=0; i<props.length, prop=props[i]; i++) {
				addRule(selector, prop, stylesheet, parentSelector);
			}
			return;
		}

		var _props = {}, 
			_selector = selector,
			_objects = {}, 
			_functions = {};

		// processing props
		for(var prop in props) {
			var type = typeof props[prop];
			if(type !== 'object' && type !== 'function' && props[prop] !== false && props[prop] !== true) {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					// moving the selector to the top of the chain
					if(_selector.indexOf("^") === 0) {
						_selector = _selector.substr(1, _selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '');
					} else {
						_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					}
					_props[prop] = props[prop];
					prefixes.addPrefixes(prop, _props);
				}
			} else if(type === 'object') {
				// classify
				if(props[prop] && typeof props[prop].classify != 'undefined' && props[prop].classify === true) {
					props[prop] = typeof props[prop].toJSON != 'undefined' ? props[prop].toJSON() : props[prop].toString();
				}
				_objects[prop] = props[prop];
			} else if(type === 'function') {
				_functions[prop] = props[prop];
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		for(var prop in _objects) {
			// check for pseudo classes			
			if(prop.charAt(0) === ":") {
				addRule(selector + prop, _objects[prop], stylesheet, parentSelector);
		    // check for ampersand operator
			} else if(/&/g.test(prop)) {
				if(/, ?/g.test(prop) && options.combineSelectors) {
					var parts = prop.replace(/, /g, ',').split(',');
					for(var i=0; i<parts.length, p=parts[i]; i++) {
						if(p.indexOf('&') >= 0) {
							addRule(p.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
						} else {
							addRule(p, _objects[prop], stylesheet, typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector);
						}
					}
				} else {
					addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
				}
			// check for media query
			} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
			// check for media query
			} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
			// moving the selector to the top of the chain
			} else if(selector.indexOf("^") === 0) {
				// selector, props, stylesheet, parentSelector
				addRule(
					selector.substr(1, selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '') + " " + prop,
					_objects[prop], 
					stylesheet
				);
			// check for plugins
			} else if(checkAndExecutePlugin(selector, prop, _objects[prop], stylesheet, parentSelector) === false) {
				addRule(prop, _objects[prop], stylesheet, (parentSelector ? parentSelector + " " : "") + selector);
			}
		}

		for(var prop in _functions) {
			var o = {};
			o[prop] = _functions[prop]();
			addRule(selector, o, stylesheet, parentSelector);
		}
		
	}

	var add = function(rules, stylesheet, opts) {

		toRegister = [];
		API.numOfAddedRules += 1;

		if(typeof stylesheet === 'object' && typeof opts === 'undefined') {
			options = stylesheet;
			stylesheet = null;
		}
		if(typeof opts != 'undefined') {
			options = opts;
		}

		var typeOfPreprocessor = API.defaultProcessor.type;

		for(var selector in rules) {
			addRule(selector, rules[selector], stylesheet || "mainstream");
		}

		// looping through the rules for registering
		for(var i=0; i<toRegister.length; i++) {
			var stylesheet = toRegister[i].stylesheet,
				selector = toRegister[i].selector,
				props = toRegister[i].props,
				allRules = API.getRules(stylesheet);
			// overwrite already added value
			var current = allRules[selector] || {};
			for(var propNew in props) {
				var value = props[propNew];
				if(typeof value != 'object') {
					if(typeOfPreprocessor == "css") {
						// appending values
						if(value.toString().charAt(0) === "+") {
							if(current && current[propNew]) {
								current[propNew] = current[propNew] + ", " + value.substr(1, value.length-1);	
							} else {
								current[propNew] = value.substr(1, value.length-1);	
							}
						} else if(value.toString().charAt(0) === ">") {
							if(current && current[propNew]) {
								current[propNew] = current[propNew] + " " + value.substr(1, value.length-1);	
							} else {
								current[propNew] = value.substr(1, value.length-1);	
							}
						} else {
							current[propNew] = value;
						}
					} else {
						current[propNew] = value;
					}
					
				}
			}
			allRules[selector] = current;
		}

		return API;
	}
	return add;
}