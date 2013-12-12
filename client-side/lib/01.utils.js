var lib = { 
	api: {},
	helpers: {},
	plugins: {},
	processors: { 
		css: { plugins: {}},
		html: { 
			plugins: {},
			helpers: {}
		},
		component: { plugins: {}}
	},
	ki: {}
};
var queue  = function(funcs, scope) {
	(function next() {
		if(funcs.length > 0) {
			funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
		}
	})();
}
var select = function(selector, parent) {
	var result;
	try {
		result = (parent || document).querySelectorAll(selector);
	} catch(err) {
		result = document.querySelectorAll(selector);
	}
	return result;
}
var str2DOMElement = function(html) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);             
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    var el = frame.contentDocument.body.firstChild;
    document.body.removeChild(frame);
    return el;
}
var addEventListener = function(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
        obj.addEventListener(evt, fnc, false);
        return true;
    } else if (obj.attachEvent) { // Microsoft model
        return obj.attachEvent('on' + evt, fnc);
    }
}