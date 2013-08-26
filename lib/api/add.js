module.exports = function(API) {
	var checkForNesting = function(selector, props) {
		for(var prop in props) {
			if(typeof props[prop] === 'object') {
				addRule(selector + " " + prop, props[prop]);
				props[prop] = false;
			}
		}
	}
	var addRule = function(selector, props) {
		if(typeof API.getRules()[selector] == 'object') {
			var current = API.getRules()[selector];
			for(var propNew in props) {
				current[propNew] = props[propNew];
			}
		} else {
			API.getRules()[selector] = props;
		}
		checkForNesting(selector, props);
	}
	var add = function(rules) {
		for(var selector in rules) {
			addRule(selector, rules[selector]);
		}
		return API;
	}
	return add;
}