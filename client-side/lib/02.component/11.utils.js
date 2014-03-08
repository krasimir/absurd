api.str2DOMElement = str2DOMElement;
api.addEventListener = addEventListener;
api.queue = queue;
api.qs = qs;
api.qsa = qsa;
api.getStyle = getStyle;
api.addClass = addClass;
api.removeClass = removeClass;
api.replaceClass = replaceClass;
api.bind = bind;
api.toggleClass = toggleClass;
api.compileHTML = function(HTML, callback, data) {
	absurd.flush().morph("html").add(HTML).compile(callback, data);
};
api.compileCSS = function(CSS, callback, options) {
	absurd.flush().add(CSS).compile(callback, options);
};
api.delay = function(time, fn, args) {
	var self = this;
	setTimeout(function() {
		fn.apply(self, args);
	}, time);
}