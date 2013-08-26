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
		console.log("-------------------------------");
		console.log(API.getRules());
		if(typeof _path == "function") {
			_path.apply(API);
		} else {
			console.log(_path.source);
			require(_path.source);
		}
		console.log(API.getRules());
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