module.exports = function(API) {
	var checkForPlugin = function(selector, prop, value, stylesheet) {
		var plugin = API.getPlugins()[prop];
		if(typeof plugin !== 'undefined') {
			addRule(selector, plugin(API, value), stylesheet);
			return true;
		} else {
			return false;
		}		
	}
	var clearingPluginsCalls = function(props) {
		var plugins = API.getPlugins();
		for(var prop in props) {
			if(typeof plugins[prop] !== 'undefined') {
				props[prop] = false;
			}
		}
	}
	var checkForNesting = function(selector, props, stylesheet) {
		for(var prop in props) {
			if(typeof props[prop] === 'object') {
				// check for pseudo classes
				if(prop.charAt(0) === ":") {
					addRule(selector + prop, props[prop], stylesheet);
				// check for media query
				} else if(prop.indexOf("@media") === 0) {
					addRule(selector, props[prop], prop);
				// check for plugins
				} else if(checkForPlugin(selector, prop, props[prop], stylesheet) === false) {
					addRule(selector + " " + prop, props[prop], stylesheet);
				}
				props[prop] = false;
			} else {
				if(checkForPlugin(selector, prop, props[prop], stylesheet)) {
					props[prop] = false;
				}
			}
		}
	}
	var addRule = function(selector, props, stylesheet) {
		// if the selector is already there
		if(typeof API.getRules(stylesheet || "mainstream")[selector] == 'object') {
			var current = API.getRules(stylesheet || "mainstream")[selector];
			for(var propNew in props) {
				current[propNew] = props[propNew];
			}
		// no, the selector is still not added
		} else {
			API.getRules(stylesheet || "mainstream")[selector] = props;
		}
		checkForNesting(selector, props, stylesheet || "mainstream");
		clearingPluginsCalls(props);
	}
	var add = function(rules) {
		for(var selector in rules) {
			if(typeof rules[selector].length !== 'undefined') {
				for(var i=0; r=rules[selector][i]; i++) {
					addRule(selector, r, "mainstream");
				}
			} else {
				addRule(selector, rules[selector], "mainstream");
			}
		}
		return API;
	}
	return add;
}