var newline = '\n';
var toCSS = function(rules) {
	var css = '';
	for(var selector in rules) {
		var entity = selector + ' {' + newline;
		for(var prop in rules[selector]) {
			var value = rules[selector][prop];
			entity += '  ' + prop + ': ' + rules[selector][prop] + ';' + newline;
		}
		entity += '}' + newline;
		css += entity;
	}
	return css;
}

// dealing with false values
var filterRules = function(rules) {
	var arr = {};
	for(var selector in rules) {
		var areThereAnyProps = false;
		var props = {};
		for(var prop in rules[selector]) {
			var value = rules[selector][prop];
			if(value !== false) {
				areThereAnyProps = true;
				props[prop] = value;
			}
		}
		if(areThereAnyProps) {
			arr[selector] = props;
		}
	}
	return arr;
}

// combining selectors
var combineSelectors = function(rules) {
	var map = {},
		arr = {};
	// creating the map
	for(var selector in rules) {
		var props = rules[selector];
		for(var prop in props) {
			var value = props[prop];
			if(!map[prop]) map[prop] = {};
			if(!map[prop][value]) map[prop][value] = [];
			map[prop][value].push(selector);
		}
	}
	// converting the map to usual rules object
	for(var prop in map) {
		var values = map[prop];
		for(var value in values) {
			var selectors = values[value];
			if(!arr[selectors.join(", ")]) arr[selectors.join(", ")] = {}
			var selector = arr[selectors.join(", ")];
			selector[prop] = value;	
		}		
	}
	return arr;
}

module.exports = function(rules, callback, options) {
	var css = '';
	for(var stylesheet in rules) {
		var r = filterRules(rules[stylesheet]);
		r = options.combineSelectors ? combineSelectors(r) : r;
		if(stylesheet === "mainstream") {
			css += toCSS(r);
		} else {
			css += stylesheet + " {" + newline + toCSS(r) + "}" + newline;
		}		
	}
	callback(null, css);
}