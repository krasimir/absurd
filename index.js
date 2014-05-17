#!/usr/bin/env node

var cli = require('./lib/CLI.js'),
	requireUncached = require('./lib/helpers/RequireUncached.js');
	fs = require("fs"),
	argv = require('optimist').argv,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	api = null,
	absurd = null,

module.exports = absurd = function(func) {
	api = require("./lib/API.js")();
	if(typeof func == "function") {
		func(api);
	} else if(typeof func == "string") {
		api.import(func);	
	} 
	return api;
}

// godlike
process.on('uncaughtException', function (err) {
    console.log("Error packing", err);
});
 
// cli
cli(argv, absurd); 