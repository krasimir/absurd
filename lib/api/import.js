var requireUncached = require('../helpers/RequireUncached.js'),
	fs = require("fs"),
	CSSParse = require("css-parse"),
	path = require("path");

module.exports = function(API) {
	var HandleCSS = {
		rule: function(rule, cssPath) {
			var absurdObj = {}, absurdProps = {};
			if(rule.declarations && rule.declarations.length > 0) {
				for(var i=0; decl=rule.declarations[i]; i++) {
					if(decl.type === "declaration") {
						absurdProps[decl.property] = decl.value;
					}
				}
				if(rule.selectors && rule.selectors.length > 0) {
					for(var i=0; selector=rule.selectors[i]; i++) {
						absurdObj[selector] = absurdProps;
					}
				}
				API.add(absurdObj);
			}
		},
		charset: function(rule, cssPath) {
			var charsetValue = rule.charset.replace(/:/g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '');
			API.raw("@charset: \"" + charsetValue + "\";");
		},
		import: function(rule, cssPath) {
			API.import(path.dirname(cssPath) + "/" + rule.import.replace(/"/g, ''));
		}
	}
	var importFile = function(path) {
		var ext = path.split('.').pop().toLowerCase();
		if(ext === "json") {
			try {
				var jsonData = fs.readFileSync(path, {encoding: "utf8"});
				var json = JSON.parse(jsonData);
				API.add(json);
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err);
			}
		} else if(ext === "css") {
			try {
				var cssData = fs.readFileSync(path, {encoding: "utf8"});
				var parsed = CSSParse(cssData);
				if(parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
					var rules = parsed.stylesheet.rules;
					for(var i=0; rule=rules[i]; i++) {
						if(HandleCSS[rule.type]) HandleCSS[rule.type](rule, path);
					}
				}
			} catch(err) {
				console.log("Error during importing of '" + path + "'", err);
			}
		} else {
			try {
				requireUncached(path)(API)
			} catch(err) {
				console.log("Error: I can't find '" + path + "'.", err);
			}
		}
	}
	return function(path) {
		if(typeof path == 'string') {
			importFile(path);
		} else {
			for(var i=0; p=path[i]; i++) {
				importFile(p);
			}
		}
		return API;
	}
}