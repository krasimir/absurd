var path = require("path");

module.exports = function(api) {

	var handlecss = function(parsed, path) {
		var plugins = api.getPlugins();
		if(parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
			var rules = parsed.stylesheet.rules;
			for(var i=0; rule=rules[i]; i++) {
				switch(rule.type) {
					case "rule": api.handlecssrule(rule); break;
					case "import": api.handlecssimport(rule, path); break;
					default:
						if(plugins[rule.type]) {
							plugins[rule.type](api, rule);
						}
					break;
				}
			}
		}
		return api;
	}

	return handlecss;	
}