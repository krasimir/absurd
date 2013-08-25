var fs = require('fs');

module.exports = function() {

	var _api = {},
		_entities = [];

	_api.getEntities = function() {
		return _entities;		
	}

	var methods = fs.readdirSync(__dirname + "/api");
	for(var i=0; i<methods.length; i++) {
		var file = methods[i];
		_api[file.replace(".js", "")] = require(__dirname + "/api/" + file);
	}

	return _api;

}