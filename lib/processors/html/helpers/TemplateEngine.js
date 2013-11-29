module.exports = function(html, options) {
	var result = html, 
		re = /{{([^}]+)}}/g, 
		match;
	var get = function(match) {
		var fn = new Function("data", "return data." + match);
		return fn(options.data);
	}
	while(match = re.exec(html)) {		
		var r = new RegExp("{{" + match[1] + "}}", "gi");
		result = result.replace(r, get(match[1]));
	}
	return result;
}