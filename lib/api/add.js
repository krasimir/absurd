module.exports = function(API) {

	return function(selector, props) {
		if(typeof API.getRules()[selector] == 'object') {
			var current = API.getRules()[selector];
			for(var propNew in props) {
				current[propNew] = props[propNew];
			}
		} else {
			API.getRules()[selector] = props;
		}
	}

}