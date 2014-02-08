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
api.addClass = function(className, el) {
	el = el || this.el;
	if(el.classList) {
		el.classList.add(className);
	} else {
		var current = el.className;
		if(current.indexOf(className) < 0) {
			if(current == '') el.className = className;
			else el.className += ' ' + className;
		}
	}
	return api;
};
api.removeClass = function(className, el) {
	el = el || this.el;
	if (el.classList) {
		el.classList.remove(className);
	} else {
		var current = el.className.split(' ');
		var newClasses = [];
		for(var i=0; i<current.length; i++) {
			if(current[i] != className) newClasses.push(current[i]);
		}
		el.className = newClasses.join(' ');
	}
	return api;
}
api.replaceClass = function(classNameA, classNameB, el) {
	el = el || this.el;
	var current = el.className.split(' '), found = false;
	for(var i=0; i<current.length; i++) {
		if(current[i] == classNameA) {
			found = true;
			current[i] = classNameB;
		}
	}
	if(!found) {
		return api.addClass(classNameB, el);
	}
	el.className = current.join(' ');
	return api;
}
api.toggleClass = function(className, el) {
	el = el || this.el;
	if (el.classList) {
		el.classList.toggle(className);
	} else {
		var classes = el.className.split(' ');
		var existingIndex = -1;
		for (var i = classes.length; i--;) {
	  		if (classes[i] === className)
	    		existingIndex = i;
		}
		
		if(existingIndex >= 0)
	  		classes.splice(existingIndex, 1);
		else
	  		classes.push(className);

		el.className = classes.join(' ');
	}
	return api;
}