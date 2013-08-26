#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	Processor = require("./lib/Processor.js"),
	API = {};

global.A = API = require("./lib/API.js")();

module.exports = function(path) {

	var _path = PathFormatter(path),
		_absurd = {};

	// --------------------------------------------------- compile
	var compile = _absurd.compile = function(callback) {
		if(typeof _path == "function") {
			_path.apply(API);
		} else {
			require(_path.source);
		}
		Processor(
			API.getRules(),
			_path.callback || callback || function() {}
		);
	}
	// --------------------------------------------------- getPaths
	var getPath = _absurd.getPath = function() {
		return _path;
	}

	return _absurd;

}