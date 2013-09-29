#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	Processor = require("./lib/Processor.js"),
	cli = require('./lib/CLI.js'),
	requireUncached = require('./lib/helpers/RequireUncached.js');
	fs = require("fs"),
	argv = require('optimist').argv,
	_ = require("underscore"),
	API = null,
	absurd = null,

module.exports = absurd = function(path) {

	API = require("./lib/API.js")();

	var _path = PathFormatter(path),
		_absurd = {api: API},
		_defaultOptions = {
			combineSelectors: true
		};

	// --------------------------------------------------- compile
	var compile = _absurd.compile = function(callback, options) {
		options = _.extend(_defaultOptions, options || {});
		if(typeof _path == "function") {
			_path(API);
		} else {		
			if(_path !== false) {
				API.import(_path.source);
			}
		}
		Processor(
			API.getRules(),
			_path.callback || callback || function() {},
			options
		);
	}
	// --------------------------------------------------- compile to file
	var compileFile = _absurd.compileFile = function(file, compileFileCallback, options) {
		compile(function(err, css) {
			try {
				fs.writeFile(file, css, function (err) {
					compileFileCallback(err, css);
				});
			} catch(err) {
				compileFileCallback(err);
			}
		}, options);
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
