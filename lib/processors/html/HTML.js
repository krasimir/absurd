// transform uppercase to [-lowercase]
var transformUppercase = function(prop) {
	var transformed = "";
	for(var i=0; c=prop.charAt(i); i++) {
		if(c === c.toUpperCase() && c.toLowerCase() !== c.toUpperCase()) {
			transformed += "-" + c.toLowerCase();
		} else {
			transformed += c;
		}
	}
	return transformed;
}

module.exports = function() {
	var newline = '\n',
		defaultOptions = {};

	var process = function(tagname, obj) {
		var html = '', attrs = '', childs = '';

		// convert object to a function
		if(typeof obj === "function") obj = obj();

		// check for attributes
		for(var prop in obj) {
			if(prop === "_attrs") {
				var value = obj[prop];
				for(var attrName in value) {
					if(typeof value[attrName] === "function") {
						attrs += " " + transformUppercase(attrName) + "=\"" + value[attrName]() + "\"";
					} else {
						attrs += " " + transformUppercase(attrName) + "=\"" + value[attrName] + "\"";
					}
				}
			}
		}

		// parses rest of the things
		for(var prop in obj) {
			var value = obj[prop];
			// directive
			if(prop.substr(0, 1) === "_") {
				switch(prop) {
					case "_": childs += value + newline; break;
				}
			// object, array, function or string
			} else {
				switch(typeof value) {
					case "string": childs += '<' + prop + '>' + value + '</' + prop + '>' + newline; break;
					case "object": 
						if(value.length && value.length > 0) {
							for(var i=0; item=value[i]; i++) {
								childs += process(prop, item);
							}
						} else {
							childs += process(prop, value);
						}
					break;
					case "function":
						childs += process(prop, value());
					break;
				}
			}
			
		}

		if(tagname != '') {
			if(childs !== '') {
				html += '<' + transformUppercase(tagname) + attrs + '>' + newline + childs + '</' + transformUppercase(tagname) + '>' + newline;
			} else {
				html += '<' + transformUppercase(tagname) + attrs + '/>' + newline;
			}
		} else {
			html += childs + newline;
		}

		return html;
	}

	return function(rules, callback, options) {
		options = options || defaultOptions;
		var html = '';
		for(var template in rules) {
			if(template == "mainstream") {
				var numOfRules = rules[template].length;
				for(var i=0; i< numOfRules; i++) {
					html += process('', rules[template][i]);
				}
			}
		}
		html = html.substr(0, html.length-2);
		callback(null, html);
		return html;
	}
}