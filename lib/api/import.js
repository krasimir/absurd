var requireUncached = require('../helpers/RequireUncached.js'),
	fs = require("fs"),
	CSSParse = require("css-parse"),
	YAMLParse = require("js-yaml"),
	path = require("path");

module.exports = function(API) {
	
	var importFile = function(path) {
		var ext = path.split('.').pop().toLowerCase();
		if(ext === "json") {
			try {
				var jsonData = fs.readFileSync(path, {encoding: "utf8"});
				var json = JSON.parse(jsonData);
				API.add(json);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "yaml" || ext === "yml") {
			try {
				var yamlData = fs.readFileSync(path, {encoding: "utf8"});
				var json = YAMLParse.safeLoad(yamlData);
				API.add(json);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "css") {
			try {
				var cssData = fs.readFileSync(path, {encoding: "utf8"});
				var parsed = CSSParse(cssData);
				API.handlecss(parsed, path);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "js") {
			try {
				requireUncached(path)(API)
			} catch(err) {
				console.log("Error: '" + path + "'.", err, err.stack);
			}
		}
	}
	
	return function(path) {
		if(typeof path == 'string') {
			importFile(path);
		} else {
			for(var i=0; p=path[i]; i++) {
				importFile(p);
			}
		}
		return API;
	}
}
