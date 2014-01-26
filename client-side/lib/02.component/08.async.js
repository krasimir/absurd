var	async = { funcs: {}, index: 0 };
api.__handleAsyncFunctions = function(next) {
	if(this.el) {
		var funcs = [];
		if(this.el.hasAttribute && this.el.hasAttribute("data-absurd-async")) {
			funcs.push(this.el);
		} else {
			var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-async]') : [];
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
	return this;	
}
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