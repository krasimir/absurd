
var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [];

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

var processTemplate = function(templateName) {
	var html = '';
	for(var template in data) {
		if(template == templateName) {
			var numOfRules = data[template].length;
			for(var i=0; i<numOfRules; i++) {
				html += process('', data[template][i]);
			}
		}
	}
	return html;
}

var process = function(tagName, obj) {
	// console.log("------------------------\n", tagName, ">", obj);

	var html = '', attrs = '', childs = '';

	if(typeof obj === "string") {
		return packTag(tagName, attrs, obj);
	}

	var addToChilds = function(value) {
		if(childs != '') { childs += newline; }
		childs += value;
	}

	// process directives
	for(var directiveName in obj) {
		var value = obj[directiveName];
		switch(directiveName) {
			case "_attrs":
				for(var attrName in value) {
					if(typeof value[attrName] === "function") {
						attrs += " " + transformUppercase(attrName) + "=\"" + value[attrName]() + "\"";
					} else {
						attrs += " " + transformUppercase(attrName) + "=\"" + value[attrName] + "\"";
					}
				}
				obj[directiveName] = false;
			break;
			case "_": 
				addToChilds(value);
				obj[directiveName] = false;
			break;
		}
	}

	for(var name in obj) {
		var value = obj[name];
		if(value !== false) {
			switch(typeof value) {
				case "string": addToChilds(process(name, value)); break;
				case "object": 
					if(value.length && value.length > 0) {
						var tmp = '';
						for(var i=0; v=value[i]; i++) {
							tmp += process('', typeof v == "function" ? v() : v);
							if(i < value.length-1) {
								tmp += newline;
							}
						}
						addToChilds(process(name, tmp));
					} else {
						addToChilds(process(name, value));
					}
				break;
				case "function": addToChilds(process(name, value())); break;
			}
		}
	}

	if(tagName != '') {
		html += packTag(tagName, attrs, childs);
	} else {
		html += childs;
	}

	return html;
}

var packTag = function(tagName, attrs, childs) {
	var html = '';
	if(childs !== '') {
		html += '<' + transformUppercase(tagName) + attrs + '>' + newline + childs + newline + '</' + transformUppercase(tagName) + '>';
	} else {
		html += '<' + transformUppercase(tagName) + attrs + '/>';
	}
	return html;
}

module.exports = function() {
	return function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = options || defaultOptions;
		var html = processTemplate("mainstream");
		callback(null, html);
		return html;
	}
}