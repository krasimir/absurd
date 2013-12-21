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
	var clearing = function(props) {
		// plugins
		var plugins = API.getPlugins();
		for(var prop in props) {
			if(typeof plugins[prop] !== 'undefined') {
				props[prop] = false;
			}
		}
		// pseudo classes
		for(var prop in props) {
			if(prop.charAt(0) === ":") {
				props[prop] = false;
			}
		}
		// ampersand 
		for(var prop in props) {
			if(/&/g.test(prop)) {
				props[prop] = false;
			}
		}
	}
	var checkForNesting = function(selector, props, stylesheet, parentSelector) {
		for(var prop in props) {
			if(typeof props[prop] === 'object') {
				// check for pseudo classes
				if(prop.charAt(0) === ":") {
					addRule(selector + prop, props[prop], stylesheet);
			    // check for ampersand operator
				} else if(/&/g.test(prop)) {
					addRule(prop.replace(/&/g, selector), props[prop], stylesheet);
				// check for media query
				} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
					addRule(selector, props[prop], prop);
				// check for media query
				} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
					addRule(prop, props[prop], selector);
				// check for plugins
				} else if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					addRule(selector + " " + prop, props[prop], stylesheet);
				}
				props[prop] = false;
			} else if(typeof props[prop] === 'function') {
				props[prop] = props[prop]();
				checkForNesting(selector, props, stylesheet);
			} else {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector)) {
					props[prop] = false;
				}
			}
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		console.log("\n---------- addRule ---------", selector, ".........", parentSelector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		var _props = {}, _selector = selector;

		if(/, ?/g.test(selector)) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);	
			}
			return;
		}

		// if array is passed as props
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=props.length-1; i>=0, prop=props[i]; i--) {
				addRule(selector, prop, stylesheet);
			}
			return;
		}
 
		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;	
		}

		// processing props
		for(var prop in props) {
			if(typeof props[prop] !== 'object' && typeof props[prop] !== 'object') {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					_props[prop] = props[prop];
				}
			} else if(typeof props[prop] === 'object') {
				// check for pseudo classes
				if(prop.charAt(0) === ":") {
					addRule(selector + prop, props[prop], stylesheet, parentSelector);
			    // check for ampersand operator
				} else if(/&/g.test(prop)) {
					addRule(prop.replace(/&/g, selector), props[prop], stylesheet, parentSelector);
				// check for media query
				} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
					addRule(selector, props[prop], prop, parentSelector);
				// check for media query
				} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
					addRule(prop, props[prop], selector, parentSelector);
				// check for plugins
				} else if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					addRule(prop, props[prop], stylesheet, (parentSelector ? parentSelector + " " : "") + selector);
				}
			} else if(typeof props[prop] === 'function') {
				var o = {};
				o[prop] = props[prop]();
				addRule(selector, o, stylesheet, parentSelector);
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		// checkForNesting(selector, props, stylesheet);
		// clearing(props);
		
	}
	var prepareRules = function(obj) {
		if(obj instanceof Array) {
			for(var i=0; i<obj.length; i++) {
				prepareRules(obj[i]);
			}
			return;
		}
		for(var prop in obj) {
			var value = obj[prop];
			if(typeof value == 'object') {
				prepareRules(value);
			}
			if(/, ?/g.test(prop)) {
				var parts = prop.replace(/, /g, ',').split(',');
				for(var i=0; i<parts.length, p=parts[i]; i++) {
					if(obj[p]) {
						obj[p] = extend({}, obj[p], value);
					} else {
						obj[p] = extend({}, value);
					}
				}
				delete obj[prop];
			}
		}
	}
	var add = function(rules, stylesheet) {

		// rules = clone(rules);
		toRegister = [];
		API.numOfAddedRules += 1;
		// prepareRules(rules);
		for(var selector in rules) {
			addRule(selector, rules[selector], stylesheet || "mainstream");
		}

		// if the selector is already there
		for(var i=0; i<toRegister.length; i++) {
			var stylesheet = toRegister[i].stylesheet,
				selector = toRegister[i].selector,
				props = toRegister[i].props,
				allRules = API.getRules(stylesheet);
			// console.log(selector, props);
			if(typeof allRules[selector] == 'object') {
				var current = allRules[selector];
				for(var propNew in props) {
					// overwrite already added value
					if(typeof props[propNew] != 'object') {
						current[propNew] = props[propNew];
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