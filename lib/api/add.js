module.exports = function(API) {
	var extend = require("../helpers/Extend");
	var clone = require("../helpers/Clone");
	var toRegister = [];
	var checkAndExecutePlugin = function(selector, prop, value, stylesheet, parentSelector) {
		var plugin = API.getPlugins()[prop];
		if(typeof plugin !== 'undefined') {
			var pluginResponse = plugin(API, value);
			if(pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		// console.log("\n---------- addRule ---------", selector, ".........", parentSelector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		if(/, ?/g.test(selector)) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);	
			}
			return;
		}

		// if array is passed as props
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=0; i<props.length, prop=props[i]; i++) {
				addRule(selector, prop, stylesheet, parentSelector);
			}
			return;
		}
 
		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;	
		}

		var _props = {}, 
			_selector = selector,
			_objects = {}, 
			_functions = {};

		// processing props
		for(var prop in props) {
			var type = typeof props[prop];
			if(type !== 'object' && type !== 'function') {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					_props[prop] = props[prop];
				}
			} else if(type === 'object') {
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
				addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
			// check for media query
			} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
			// check for media query
			} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
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
	var add = function(rules, stylesheet) {

		toRegister = [];
		API.numOfAddedRules += 1;

		for(var selector in rules) {
			addRule(selector, rules[selector], stylesheet || "mainstream");
		}

		// if the selector is already there
		for(var i=0; i<toRegister.length; i++) {
			var stylesheet = toRegister[i].stylesheet,
				selector = toRegister[i].selector,
				props = toRegister[i].props,
				allRules = API.getRules(stylesheet);
			// overwrite already added value
			if(typeof allRules[selector] == 'object') {
				var current = allRules[selector];
				for(var propNew in props) {
					if(typeof props[propNew] != 'object') {
						var value = props[propNew];
						if(value.charAt(0) === "+") {
							current[propNew] = current[propNew] + ", " + value.substr(1, value.length-1);	
						} else {
							current[propNew] = props[propNew];
						}
					}
				}
			// no, the selector is still not added
			} else {
				allRules[selector] = props;
			}
		}

		return API;
	}
	return add;
}