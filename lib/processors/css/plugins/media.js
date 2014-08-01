module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {}, json = {};
			for(var i=0; rule=value.rules[i]; i++) {
				var
					r, rjson;
				if (rule.selectors) {
					r = rules[rule.selectors.toString()] = {};
					rjson = json[rule.selectors.toString()] = {};
					if(rule.type === "rule") {
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								r[declaration.property] = declaration.value;
								rjson[declaration.property] = declaration.value;
							}
						}
					}
				}
				
			}
			content += processor({mainstream: rules});
			content += "}";
			if(api.jsonify) {
				api.add(json, '@media ' + value.media);
			} else {
				api.raw(content);
			}
		}
	}
}