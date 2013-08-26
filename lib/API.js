var fs = require('fs');

module.exports = function() {

	var _api = {},
		_rules = [];

	_api.getRules = function() {
		return _rules;		
	}
	_api.flush = function() {
		_rules = [];
	}

	// registering API methods
	var methods = fs.readdirSync(__dirname + "/api");
	for(var i=0; i<methods.length; i++) {
		var file = methods[i];
		_api[file.replace(".js", "")] = require(__dirname + "/api/" + file)(_api);
	}

	return _api;

}