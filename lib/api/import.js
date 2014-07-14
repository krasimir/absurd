var requireUncached = require('../helpers/RequireUncached.js'),
	fs = require("fs"),
	CSSParse = require("../helpers/CSSParse"),
	YAMLParse = require("js-yaml"),
	path = require("path");

module.exports = function(API) {

	var importFile = function(path, callback) {
		var ext = path.split('.').pop().toLowerCase();

		if(ext === "json") {
			try {
				var jsonData = fs.readFileSync(path, {encoding: "utf8"});
				var json = JSON.parse(jsonData);
        		if(typeof callback === 'function') {
					callback(json);
        		} else {
        			API.add(json);
        		}
        		API.express('addImport')(path);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "yaml" || ext === "yml") {
			try {
				var yamlData = fs.readFileSync(path, {encoding: "utf8"});
				var yaml = YAMLParse.safeLoad(yamlData);
				if(typeof callback === 'function') {
					callback(yaml);
                } else {
                  	API.add(yaml);
                }
                API.express('addImport')(path);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "css") {
			try {
				var cssData = fs.readFileSync(path, {encoding: "utf8"});
				var parsed = CSSParse(cssData);
        		if(typeof callback === 'function') {
					callback(parsed);
        		} else {
        			API.handlecss(parsed, path);
        		}
        		API.express('addImport')(path);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err, err.stack);
			}
		} else if(ext === "js") {
			try {
        		if(typeof callback === 'function') {
					requireUncached(path)(API, callback);
        		} else {
          			requireUncached(path)(API);
          		}
        		API.express('addImport')(path);
			} catch(err) {
				console.log("Error: '" + path + "'.", err, err.stack);
			}
		}
	}

	return function() {
		var p, _i, _len, path = null, importcallback, compilecallback, options = null;

		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": importcallback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object":
					if(Array.prototype.isPrototypeOf(arguments[i])) {
						path = arguments[i];
					} else {
						options = arguments[i];
                        if(options && typeof options.callback === 'function') {
                          	compilecallback = options.callback;
                      	}
                    }
					break;
			}
		}

		if (typeof path === 'string') {
			importFile(path, importcallback);
		} else {
			for(_i = 0, _len = path.length; _i<_len; _i++) {
				p = path[_i];
				if(typeof p === 'string') {
					importFile(p, importcallback);
				}
			}
		}

		if(options) {
			return API.compile(compilecallback, options);
		} else {
			return API;
		}
    };
}
