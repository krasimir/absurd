var require = function(v) {
	// css preprocessor
	if(v.indexOf('css/CSS.js') > 0 || v == '/../CSS.js') {
		return lib.processors.css.CSS;
	} else if(v.indexOf('html/HTML.js') > 0) {
		return lib.processors.html.HTML;
	} else if(v.indexOf('component/Component.js') > 0) {
		return lib.processors.component.Component;
	} else if(v == 'js-beautify') {
		return { 
			html: function(html) {
				return html;
			}
		}
	} else if(v == './helpers/PropAnalyzer') {
		return lib.processors.html.helpers.PropAnalyzer;
	} else if(v == '../../helpers/TransformUppercase') {
		return lib.helpers.TransformUppercase;
	} else if(v == './helpers/TemplateEngine') {
		return lib.processors.html.helpers.TemplateEngine;
	} else if(v == '../helpers/Extend') {
		return lib.helpers.Extend;
	} else if(v == '../helpers/Clone') {
		return lib.helpers.Clone;
	} else if(v == '../helpers/Prefixes' || v == '/../../../helpers/Prefixes') {
		return lib.helpers.Prefixes;
	} else {
		return function() {}
	}
};
var __dirname = "";