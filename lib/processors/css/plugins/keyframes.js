module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		var prefixes = require(__dirname + "/../../../helpers/Prefixes");
		if(typeof value === "object") {			
			// js or json
			if(typeof value.frames != "undefined") {
				for(var frame in value.frames) {
					for(var prop in value.frames[frame]) {
						var plugin = api.getPlugins()[prop];
						if(typeof plugin !== 'undefined') {
							var prefix = prefixes.nonPrefixProp(prop);
							var pluginResponse = plugin(api, value.frames[frame][prop], prefix.prefix);
							if(pluginResponse) {
								delete value.frames[frame][prop];
								for(var prKey in pluginResponse) {
									value.frames[frame][prKey] = pluginResponse[prKey];
								}
							}
						} else {
							prefixes.addPrefixes(prop, value.frames[frame]);
						}
					}
				}
				var content = '@keyframes ' + value.name + " {\n";
				content += processor({mainstream: value.frames}, null, {combineSelectors: false});
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
				content += processor({mainstream: frames}, null, {combineSelectors: false});
				content += "}";
				api.raw(content + "\n" + content.replace("@keyframes", "@-webkit-keyframes"));
			}
		}
	}
}