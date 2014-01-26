var	appended = false,
	async = { funcs: {}, index: 0 },
	cache = { events: {} };

var handleAsyncFunctions = function(next) {
	if(HTMLElement) {
		var funcs = [];
		if(HTMLElement.hasAttribute && HTMLElement.hasAttribute("data-absurd-async")) {
			funcs.push(HTMLElement);
		} else {
			var els = HTMLElement.querySelectorAll ? HTMLElement.querySelectorAll('[data-absurd-async]') : [];
			for(var i=0; i<els.length; i++) {
				funcs.push(els[i]);
			}
		}
		if(funcs.length === 0) {
			next();
		} else {
			var self = this;
			(function callFuncs() {
				if(funcs.length === 0) {						
					next();
				} else {
					var el = funcs.shift(),
						value = el.getAttribute("data-absurd-async"),
						replaceNodes = function(childElement) {
							if(typeof childElement === 'string') {
								el.parentNode.replaceChild(str2DOMElement(childElement), el);
							} else {
								el.parentNode.replaceChild(childElement, el);
							}
							callFuncs();
						};
					if(typeof self[async.funcs[value].name] === 'function') {
						self[async.funcs[value].name].apply(self, [replaceNodes].concat(async.funcs[value].args));
					} else if(typeof async.funcs[value].func === 'function') {
						async.funcs[value].func.apply(self, [replaceNodes].concat(async.funcs[value].args));
					}
				}
			})();
		}			
	} else {
		next();
	}		
}
var append = function(next) {
	if(!appended && HTMLElement && this.get("parent")) {
		appended = true;
		this.get("parent").appendChild(HTMLElement);
	}
	next();
}
var handleEvents = function(next) {		
	if(HTMLElement) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			attrValue = attrValue.split(":");
			if(attrValue.length >= 2) {
				if(!cache.events[attrValue[0]] || cache.events[attrValue[0]].indexOf(el) < 0) {
					if(!cache.events[attrValue[0]]) cache.events[attrValue[0]] = [];
					cache.events[attrValue[0]].push(el);
					addEventListener(el, attrValue[0], function(e) {
						if(typeof self[attrValue[1]] === 'function') {
							self[attrValue[1]](e);
						}
					});
				}
			}
		}
		if(HTMLElement.hasAttribute && HTMLElement.hasAttribute('data-absurd-event')) {
			registerEvent(HTMLElement);
		}
		var els = HTMLElement.querySelectorAll ? HTMLElement.querySelectorAll('[data-absurd-event]') : [];
		for(var i=0; i<els.length; i++) {
			registerEvent(els[i]);
		}
	}
	next();
}


api.populate = function(options) {
	queue([
		api.__handleCSS,
		api.__handleHTML,
		append, 
		handleEvents,
		handleAsyncFunctions,
		function() {
			async = { funcs: {}, index: 0 }
			var data = {
				css: CSS, 
				html: { 
					element: HTMLElement 
				}
			};
			this.dispatch("populated", data);
			if(options && typeof options.callback === 'function') { options.callback(data); }	
		}
	], this);
	return this;
};
api.el = function() {
	return HTMLElement;
};
api.wire = function(event) {
	absurd.components.events.on(event, this[event] || function() {}, this);
};
api.async = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		func = args.shift(),
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, name: func};
	return '<script data-absurd-async="' + index + '"></script>';
};
api.child = function() {			
	var args = Array.prototype.slice.call(arguments, 0),
		children = this.get("children"),
		component = children && children[args.shift()],
		index = '_' + (async.index++);
	async.funcs[index] = {args: args, func: function(callback) {
		component.populate({callback: function(data) {
			callback(data.html.element);
		}});
	}};
	return '<script data-absurd-async="' + index + '"></script>';
};
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