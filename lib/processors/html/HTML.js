var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [],
	beautifyHTML = require('js-beautify').html,
	analizeProperty = require("./helpers/PropAnalyzer"),
	transformUppercase = require("./helpers/TransformUppercase"),
	templateEngine = require("./helpers/TemplateEngine");

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

	var tagAnalized = analizeProperty(tagName);
	tagName = tagAnalized.tag;
	if(tagAnalized.attrs != "") {
		attrs += " " + tagAnalized.attrs;
	}

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
			case "_tpl": 
				if(typeof value == "string") {
					addToChilds(processTemplate(value));
				} else if(value instanceof Array) {
					var tmp = '';
					for(var i=0; tpl=value[i]; i++) {
						tmp += processTemplate(tpl)
						if(i < value.length-1) tmp += newline;
					}
					addToChilds(tmp);
				}
				obj[directiveName] = false;
			break;
			case "_include":
				var tmp = '';
				var add = function(o) {
					if(typeof o === "function") { o = o(); }
					if(o.css && o.html) { o = o.html; } // catching a component
					tmp += process('', o);
				}
				if(value instanceof Array) {
					for(var i=0; i<value.length, o=value[i]; i++) {
						add(o);
					}
				} else if(typeof value === "object"){
					add(value);
				}
				addToChilds(tmp);
				obj[directiveName] = false;
			break;
		}
	}

	for(var prop in obj) {
		var value = obj[prop];
		if(value !== false) {
			var name = prop;
			switch(typeof value) {
				case "string": addToChilds(process(name, value)); break;
				case "object": 
					if(value.length && value.length > 0) {
						var tmp = '';
						for(var i=0; v=value[i]; i++) {
							tmp += process('', typeof v == "function" ? v() : v);
							if(i < value.length-1) tmp += newline;
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
	tagName = tagName == '' ? 'div' : tagName;
	if(childs !== '') {
		html += '<' + transformUppercase(tagName) + attrs + '>' + newline + childs + newline + '</' + transformUppercase(tagName) + '>';
	} else {
		html += '<' + transformUppercase(tagName) + attrs + '/>';
	}
	return html;
}
var prepareHTML = function(html, options) {
	html = templateEngine(html, options)
	if(options.minify) {
		return html.replace(/\n/g, '');
	} else {
		if(options.skipIndentation) {
			return html;
		} else {
			return beautifyHTML(html, {indent_size: options.indentSize || 4});
		}
	}
}
module.exports = function() {
	var processor = function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = options || defaultOptions;
		var html = prepareHTML(processTemplate("mainstream"), options);
		callback(null, html);
		return html;
	}
	processor.type = "html";
	return processor;
}