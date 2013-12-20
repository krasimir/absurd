var fs = require("fs"),
	path = require("path");

module.exports = function(API) {
	
	var importFile = function(path) {
		var fileContent = fs.readFileSync(path, {encoding: "utf8"});
		API.raw(fileContent);
	}
	
	return function(path) {
		var p, _i, _len;
		if (typeof path === 'string') {
			importFile(path);
		} else {
			for (_i = 0, _len = path.length; _i < _len; _i++) {
				p = path[_i];
				importFile(p);
			}
		}
		return API;
    };
}
