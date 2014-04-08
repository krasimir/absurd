module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		var prefixes = require(__dirname + "/../../../helpers/Prefixes");
		if(typeof value === "object") {
			// js or json
			var frames;
			if(typeof value.frames != "undefined") {
				frames = value.frames;
			// css
			} else if(typeof value.keyframes != "undefined") {
				frames = {};
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
			}
			if(api.jsonify) {
				var r = {};
				r.keyframes = {
					name: value.name,
					frames: frames
				}
				api.add(r);
			} else {
				var absurd = require(__dirname + '/../../../../')();
				absurd.add(frames).compile(function(err, css) {
					var content = '@keyframes ' + value.name + " {\n";
					content += css;
					content += "}";
					content = content + "\n" + content.replace("@keyframes", "@-webkit-keyframes");
					api.raw(content);
				}, {combineSelectors: false});	
			}			
		}
	}
}