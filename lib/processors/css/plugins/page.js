module.exports = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var content = ""; 
			if(value.selectors.length > 0) {
				content += "@page " + value.selectors.join(", ") + " {\n";
			} else {
				content += "@page {\n";
			}
			for(var i=0; declaration=value.declarations[i]; i++) {
				if(declaration.type == "declaration") {
					content += "  " + declaration.property + ": " + declaration.value + ";\n";
				}
			}
			content += "}";
			api.raw(content);
		}
	}
}