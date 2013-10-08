module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../Processor");
		if(typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {};
			for(var i=0; rule=value.rules[i]; i++) {				
				var r = rules[rule.selectors.toString()] = {};
				if(rule.type === "rule") {
					for(var j=0; declaration=rule.declarations[j]; j++) {
						if(declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({mainstream: rules});
			content += "}";
			api.raw(content);
		}
	}
}