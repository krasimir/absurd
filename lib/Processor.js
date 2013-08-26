var toCSS = function(rules) {
	var css = '',
		newline = '\n';
	for(var selector in rules) {
		css += selector + ' {' + newline;
		for(var prop in rules[selector]) {
			var value = rules[selector][prop];
			css += '  ' + prop + ': ' + rules[selector][prop] + ';' + newline;
		}
		css += '}' + newline;
	}
	return css;
}

module.exports = function(rules, callback) {
	callback(null, toCSS(rules))
}