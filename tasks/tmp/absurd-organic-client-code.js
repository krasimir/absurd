var o = {
	helpers: {},
	lib: {
		atoms: {},
		molecules: {}
	}
}
var require = function(v) {
	if(v == "./helpers/extend") {
		return o.helpers.extend;
	} else if(v == "/helpers/snippets" || v == "../../helpers/snippets") {
		return o.helpers.snippets;
	} else if(v == "/lib/atoms/atoms" || v == "../../lib/atoms/atoms" || v == "../atoms/atoms.js") {
		return o.lib.atoms.atoms;
	} else if(v == "../../helpers/units") {
		return o.helpers.units;
	} else if(v == "../../helpers/args") {
		return o.helpers.args;
	} else if(v == "path") {
		return {
			basename: function(f) { 
				return f.split("/").pop(); 
			}
		}
	} else {
		var moduleParts = v.split("/");
		return (function getModule(currentModule) {
			var part = moduleParts.shift().replace(".js", "");
			if(currentModule[part]) {
				if(moduleParts.length == 0) {
					return currentModule[part];
				} else {
					return getModule(currentModule[part])
				}
			}
		})(o);
	}
}
var __dirname = '';
var walkClientSide = function(res, obj, path) {
	if(typeof res == 'undefined') res = [];
	if(typeof obj == 'undefined') obj = o.lib;
	if(typeof path == 'undefined') path = "lib/";
	for(var part in obj) {
		if(typeof obj[part] == 'function') {
			res.push(path + part + ".js");
		} else {
			walkClientSide(res, obj[part], path + part + "/");
		}
	}
	return res;
};