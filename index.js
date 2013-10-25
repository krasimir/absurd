#!/usr/bin/env node

var cli = require('./lib/CLI.js'),
	requireUncached = require('./lib/helpers/RequireUncached.js');
	fs = require("fs"),
	argv = require('optimist').argv,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	API = null,
	absurd = null,

module.exports = absurd = function(func) {

	API = require("./lib/API.js")();

	var _defaultOptions = {
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
		if(typeof func == "function") {
			func(API);
		} else if(typeof func == "string") {
			API.import(func);	
		}
		options.processor(
			API.getRules(),
			callback || function() {},
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

	return API;

}

// godlike
process.on('uncaughtException', function (err) {
    console.log("Error packing", err);
});

// cli
cli(argv, absurd);
