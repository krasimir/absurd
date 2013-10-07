var path = require("path");

module.exports = function(api) {

	var handleImport = function(rule, cssPath) {
		API.import(path.dirname(cssPath) + "/" + rule.import.replace(/"/g, ''));
		return api;
	}

	return handleImport;

};