var metamorphosis = {
	html: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/html/HTML.js")();
		api.hook("add", function(tags, template) {
			api.getRules(template || "mainstream").push(tags);
			return true;
		});
	},
	component: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/component/Component.js")();
		api.hook("add", function(component) {
			if(!(component instanceof Array)) component = [component];
			for(var i=0; i<component.length, c = component[i]; i++) {
				api.getRules("mainstream").push(c);
			}
			return true;
		});	
	},
	jsonify: function(api) {
		api.jsonify = true;
	},
	'dynamic-css': function(api) {
		api.dynamicCSS = true;
	}
}
module.exports = function(api) {
	return function(type) {
		if(metamorphosis[type]) {
			api.flush();
			metamorphosis[type](api);
		}
		return api;
	}
}