#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	Processor = require("./lib/Processor.js"),
	API = null,
	fs = require("fs");



module.exports = function(path) {

	API = require("./lib/API.js")();

	var _path = PathFormatter(path),
		_absurd = {};

	// --------------------------------------------------- compile
	var compile = _absurd.compile = function(callback) {
		if(typeof _path == "function") {
			_path(API);
		} else {
			require(_path.source)(API);
		}
		Processor(
			API.getRules(),
			_path.callback || callback || function() {}
		);
	}
	// --------------------------------------------------- compile to file
	var compileFile = _absurd.compileFile = function(file, compileFileCallback) {
		compile(function(err, css) {
			try {
				fs.writeFile(file, css, function (err) {
					compileFileCallback(err, css);
				});
			} catch(err) {
				compileFileCallback(err);
			}
		});
	}
	// --------------------------------------------------- getPaths
	var getPath = _absurd.getPath = function() {
		return _path;
	}

	return _absurd;

}