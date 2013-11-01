module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {			
			// js or json
			if(typeof value.frames != "undefined") {
				var content = '@keyframes ' + value.name + " {\n";
				content += processor({mainstream: value.frames});
				content += "}";
				api.raw(content + "\n" + content.replace("@keyframes", "@-webkit-keyframes"));
			// css
			} else if(typeof value.keyframes != "undefined") {
				var content = '@keyframes ' + value.name + " {\n";
				var frames = {};
				for(var i=0; rule=value.keyframes[i]; i++) {
					if(rule.type === "keyframe") {
						var f = frames[rule.values] = {};
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								f[declaration.property] = declaration.value;
							}
						}
					}
				}
				content += processor({mainstream: frames});
				content += "}";
				api.raw(content + "\n" + content.replace("@keyframes", "@-webkit-keyframes"));
			}
		}
	}
}