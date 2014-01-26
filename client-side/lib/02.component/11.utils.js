api.utils = {
	str2DOMElement: str2DOMElement,
	addEventListener: addEventListener,
	queue: queue,
	compileHTML: function(HTML, data, callback) {
		absurd.flush().morph("html").add(HTML).compile(callback, data);
	},
	compileCSS: function(CSS, data, callback) {
		absurd.flush().add(CSS).compile(callback, data);
	}
}