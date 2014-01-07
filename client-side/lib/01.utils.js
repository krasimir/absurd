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
	}
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
    var temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.childNodes[0];
}
var addEventListener = function(obj, evt, fnc) {
    if (obj.addEventListener) { // W3C model
        obj.addEventListener(evt, fnc, false);
        return true;
    } else if (obj.attachEvent) { // Microsoft model
        return obj.attachEvent('on' + evt, fnc);
    }
}
var removeEmptyTextNodes = function(elem) {
    var children = elem.childNodes;
    var child;
    var len = children.length;
    var i = 0;
    var whitespace = /^\s*$/;
    for(; i < len; i++){
        child = children[i];
        if(child.nodeType == 3){
            if(whitespace.test(child.nodeValue)){
                elem.removeChild(child);
                i--;
                len--;
            }
        }
    }
    return elem;
}