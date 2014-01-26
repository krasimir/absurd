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