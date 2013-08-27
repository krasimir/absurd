var toCSS = function(rules) {
	var css = '',
		newline = '\n';
	for(var selector in rules) {
		var entity = selector + ' {' + newline,
			areThereAnyProps = false;
		for(var prop in rules[selector]) {
			var value = rules[selector][prop];
			if(value !== false) {
				areThereAnyProps = true;
				entity += '  ' + prop + ': ' + rules[selector][prop] + ';' + newline;
			}
		}
		entity += '}' + newline;
		css += areThereAnyProps ? entity : '';
	}
	return css;
}

module.exports = function(rules, callback) {
	callback(null, toCSS(rules))
}