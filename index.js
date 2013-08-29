#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	Processor = require("./lib/Processor.js"),
	API = null,
	absurd = null,
	fs = require("fs"),
	argv = require('optimist').argv,
	cli = require('./lib/CLI.js');

module.exports = absurd = function(path) {

	API = require("./lib/API.js")();

	var _path = PathFormatter(path),
		_absurd = {api: API};

	// --------------------------------------------------- compile
	var compile = _absurd.compile = function(callback) {
		if(typeof _path == "function") {
			_path(API);
		} else {		
			if(_path !== false) {
				try {
					require(_path.source)(API);
				} catch(err) {
					console.log("Error: I can't find '" + _path.source + "'.");
				}
			}
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

// godlike
process.on('uncaughtException', function (err) {
    console.log("Error packing", err);
});

// cli
cli(argv, absurd);
