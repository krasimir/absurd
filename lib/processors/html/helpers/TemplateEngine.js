module.exports = function(html, options) {
	var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
		matches = [], code = 'var r=[];\n', cursor = 0;
	var compile = function(code) {
		return (new Function("data", code.replace(/[\r\t\n]/g, ''))).apply(options);
	}
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) matches.push(match);
	for(var i=0; i<matches, m=matches[i]; i++) {
		add(html.slice(cursor, m.index))(m[1], true);
		cursor = m.index + m[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code += 'return r.join("");';
	return compile(code);
}