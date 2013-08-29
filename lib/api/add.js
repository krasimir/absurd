module.exports = function(API) {
	var checkForNesting = function(selector, props) {
		for(var prop in props) {
			if(typeof props[prop] === 'object') {
				// check for pseudo classes
				if(prop.charAt(0) === ":") {
					addRule(selector + prop, props[prop]);
				} else {
					addRule(selector + " " + prop, props[prop]);
				}
				props[prop] = false;
			}
		}
	}
	var addRule = function(selector, props) {
		// if the selector is already there
		if(typeof API.getRules()[selector] == 'object') {
			var current = API.getRules()[selector];
			for(var propNew in props) {
				current[propNew] = props[propNew];
			}
		// no, the selector is still not added
		} else {
			API.getRules()[selector] = props;
		}
		checkForNesting(selector, props);
	}
	var add = function(rules) {
		for(var selector in rules) {
			if(typeof rules[selector].length !== 'undefined') {
				for(var i=0; r=rules[selector][i]; i++) {
					addRule(selector, r);
				}
			} else {
				addRule(selector, rules[selector]);
			}
		}
		return API;
	}
	return add;
}