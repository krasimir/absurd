var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [],
	beautifyHTML = require('js-beautify').html,
	tu = require("../../helpers/TransformUppercase"),
	passedOptions = {};

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
var prepareProperty = function(prop, options) {
	if(options && options.keepCamelCase === true) {
		return prop;
	} else {
		return tu(prop, options);
	}
}
var process = function(tagName, obj) {
	// console.log("------------------------\n", tagName, ">", obj);

	var html = '', attrs = '', childs = '';

	var tagAnalized = require("./helpers/PropAnalyzer")(tagName);
	tagName = tagAnalized.tag;
	if(tagAnalized.attrs != "") {
		attrs += " " + tagAnalized.attrs;
	}

	if(typeof obj === "string" || obj === null) {
		return packTag(tagName, attrs, obj);
	}

	var addToChilds = function(value) {
		if(childs != '') { childs += newline; }
		childs += value;
	}

	var addEventAttribute = function(obj) {
		var addition = [];
		for(var eventName in obj) {
			addition.push(eventName.replace(/^\$/, '') + ':' + obj[eventName]);
		}
		if(addition.length > 0) {
			if(/data-absurd-event/g.test(attrs)) {
				attrs.replace(/data-absurd-event="(.*)"/, 'data-absurd-event="$1,' + addition.join(',') + '"');
			} else {
				attrs += ' data-absurd-event="' + addition.join(',') + '"';
			}
		}
	}

	// process directives
	for(var directiveName in obj) {
		var value = obj[directiveName];
		if(/^\$/.test(directiveName)) {
			addEventAttribute(obj);
		} else {
			switch(directiveName) {
				case "_attrs":
					for(var attrName in value) {
						if(typeof value[attrName] === "function") {
							attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName]() + "\"";
						} else {
							attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName] + "\"";
						}
					}
				break;
				case "_":
					addToChilds(value);
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
				break;
				default:
					switch(typeof value) {
						case "string": addToChilds(process(directiveName, value)); break;
						case "object": 
							if(value && value.length && value.length > 0) {
								var tmp = '';
								for(var i=0; v=value[i]; i++) {
									tmp += process('', typeof v == "function" ? v() : v);
									if(i < value.length-1) tmp += newline;
								}
								addToChilds(process(directiveName, tmp));
							} else {
								addToChilds(process(directiveName, value));
							}
						break;
						case "function": addToChilds(process(directiveName, value())); break;
					}
				break;
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
	if(tagName == '' && attrs == '' && childs != '') {
		return childs;
	}
	tagName = tagName == '' ? 'div' : tagName;
	if(childs !== null) {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '>' + newline + childs + newline + '</' + prepareProperty(tagName, passedOptions) + '>';
	} else {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '/>';
	}
	return html;
}
var prepareHTML = function(html) {
	html = require("./helpers/TemplateEngine")(html.replace(/[\r\t\n]/g, ''), passedOptions);
	if(passedOptions.minify) {
		return html;
	} else {
		return beautifyHTML(html, {indent_size: passedOptions.indentSize || 4});
	}
}
module.exports = function() {
	var processor = function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = passedOptions = options || defaultOptions;
		var html = prepareHTML(processTemplate("mainstream"));
		callback(null, html);
		return html;
	}
	processor.type = "html";
	return processor;
}