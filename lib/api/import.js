var requireUncached = require('../helpers/RequireUncached.js'),
	fs = require("fs");
module.exports = function(API) {
	var importFile = function(path) {
		if(path.split('.').pop().toLowerCase() === "json") {
			try {
				var jsonData = fs.readFileSync(path, {encoding: "utf8"});
				var json = JSON.parse(jsonData);
				API.add(json);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err);
			}
		} else {
			try {
				requireUncached(path)(API)
			} catch(err) {
				console.log("Error: I can't find '" + path + "'.", err);
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