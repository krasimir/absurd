module.exports = function(html, options) {
	var re = /{{([^}]+)}}/g,
		matches = [],
		code = 'var r="";', cursor = 0;
	var get = function(code) {
		code = code.replace(/[\r\t\n]/g, '');
		var fn = new Function("data", code);
		return fn.apply(options);
	}
	while(match = re.exec(html)) matches.push(match);
	for(var i=0; i<matches, m=matches[i]; i++) {
		code += 'r += "' + html.slice(cursor, m.index).replace(/"/g, '\\"') + '";';
		code += 'r += ' + m[1] + ';';
		cursor = m.index + m[0].length;
	}
	code += 'r += "' + html.substr(cursor, html.length - cursor).replace(/"/g, '\\"') + '";return r;';
	return get(code);
}