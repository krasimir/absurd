#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	Processor = require("./lib/Processor.js"),
	API = {},
	fs = require("fs");

global.A = API = require("./lib/API.js")();

module.exports = function(path) {

	API.flush();

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
	// --------------------------------------------------- compile to file
	var compileFile = _absurd.compileFile = function(file, compileFileCallback) {
		compile(function(err, css) {
			fs.writeFile(file, css, function (err) {
				compileFileCallback(err, css);
			});
		});
	}
	// --------------------------------------------------- getPaths
	var getPath = _absurd.getPath = function() {
		return _path;
	}

	return _absurd;

}