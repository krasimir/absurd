#!/usr/bin/env node

var PathsFormatter = require("./lib/helpers/PathsFormatter.js");

module.exports = function(paths) {

	var _paths = PathsFormatter(paths),
		_api = {};

	var compile = _api.compile = function(callback) {
		
	}
	var getPaths = _api.getPaths = function() {
		return _paths;
	}

	return _api;

}