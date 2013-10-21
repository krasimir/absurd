#!/usr/bin/env node

var PathFormatter = require("./lib/helpers/PathFormatter.js"),
	cli = require('./lib/CLI.js'),
	requireUncached = require('./lib/helpers/RequireUncached.js');
	fs = require("fs"),
	argv = require('optimist').argv,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	API = null,
	absurd = null,

module.exports = absurd = function(path) {

	API = require("./lib/API.js")();

	var _path = PathFormatter(path),
		_defaultOptions = {
			combineSelectors: true,
			minify: false,
			processor: require("./lib/processors/CSS.js")
		};

	var extend = function(destination, source) {
		for (var key in source) {
			if (hasOwnProperty.call(source, key)) {
				destination[key] = source[key];
			}
		}
		return destination;
	};

	// --------------------------------------------------- compile
	var compile = API.compile = function(callback, options) {
		options = extend(_defaultOptions, options || {});
		if(typeof _path == "function") {
			_path(API);
		} else {
			if(_path !== false) {
				API.import(_path.source);
			}
		}
		options.processor(
			API.getRules(),
			_path.callback || callback || function() {},
			options
		);
	}
	// --------------------------------------------------- compile to file
	var compileFile = API.compileFile = function(file, compileFileCallback, options) {
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
	var getPath = API.getPath = function() {
		return _path;
	}

	return API;

}

// godlike
process.on('uncaughtException', function (err) {
    console.log("Error packing", err);
});

// cli
cli(argv, absurd);
