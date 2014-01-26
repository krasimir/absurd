api.str2DOMElement = str2DOMElement;
api.addEventListener = addEventListener;
api.queue = queue;
api.compileHTML = function(HTML, callback, data) {
	absurd.flush().morph("html").add(HTML).compile(callback, data);
};
api.compileCSS = function(CSS, callback, options) {
	absurd.flush().add(CSS).compile(callback, options);
};
api.qs = function(selector, parent) {
	return (parent || this.el || document).querySelector(selector);
};
api.qsa = function(selector, parent) {
	return (parent || this.el || document).querySelectorAll(selector);
};
api.getStyle = function(styleProp, el) {
	el = el || this.el;
	if(el && el.currentStyle) {
		return el.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	}
	return null;
};