var requireUncached = require('../helpers/RequireUncached.js'),
	fs = require("fs"),
	CSSParse = require("../helpers/CSSParse"),
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
				var yaml = YAMLParse.safeLoad(yamlData);
				API.add(yaml);
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
	
	return function() {
		var p, _i, _len, path = null, callback, options = null;
		
		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": callback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object": 
					if(Array.prototype.isPrototypeOf(arguments[i]))
						path = arguments[i];
					else 
						options = arguments[i]; 
					break;
			}
		}
		
		if (typeof path === 'string') {
			importFile(path);
		} else {
			for (_i = 0, _len = path.length; _i < _len; _i++) {
				p = path[_i];
				importFile(p);
			}
		}
		
		if(options){
			return API.compile(callback, options);
		} else {
			return API;
		}
    };
}
