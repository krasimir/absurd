var require = function(v) {
	// css preprocessor
	if(v.indexOf('css/CSS.js') > 0) {
		return lib.processors.css.CSS;
	} else if(v.indexOf('html/HTML.js') > 0) {
		return lib.processors.html.HTML;
	} else if(v.indexOf('component/Component.js') > 0) {
		return lib.processors.component.Component;
	} else {
		return function() {}
	}
};
var __dirname = "";