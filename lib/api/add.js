module.exports = function(API) {
	var checkForNesting = function(selector, props) {
		for(var prop in props) {
			if(typeof props[prop] === 'object') {
				add(selector + " " + prop, props[prop]);
				props[prop] = false;
			}
		}
	}
	var add = function(selector, props) {
		if(typeof API.getRules()[selector] == 'object') {
			var current = API.getRules()[selector];
			for(var propNew in props) {
				current[propNew] = props[propNew];
			}
		} else {
			API.getRules()[selector] = props;
		}
		checkForNesting(selector, props);
		return API;
	}
	return add;
}