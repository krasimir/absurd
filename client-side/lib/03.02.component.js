var Component = function(name, absurd) {
	var CSS = false, 
		HTMLSource = false, 
		HTMLElement = false,
		extend = lib.helpers.Extend,
		storage = {},
		appended = false,
		async = { funcs: {}, index: 0 },
		cache = { events: {} };
	var handleCSS = function(next) {
		if(this.css) {
			absurd.flush().add(this.css).compile(function(err, css) {
				if(!CSS) {
					var style = document.createElement("style");
				    style.setAttribute("id", name + '-css');
				    style.setAttribute("type", "text/css");
				    style.innerHTML = css;
					(select("head") || select("body"))[0].appendChild(style);
					CSS = { raw: css, element: style };
				} else if(CSS.raw !== css) {
					CSS.raw = css;
					CSS.element.innerHTML = css;
				}
				next();
			});
		} else {
			next();
		}
	}
	var setHTMLSource = function(next) {
		if(this.html) {
			if(typeof this.html === 'string') {
				if(HTMLElement === false) {
					var element = select(this.html);
					if(element.length > 0) {
						HTMLElement = element[0];
					}
					HTMLSource = {'': HTMLElement.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
				}
				next();
			} else if(typeof this.html === 'object') {
				HTMLSource = extend({}, this.html);
				if(HTMLElement === false) {
					absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
						HTMLElement = str2DOMElement(html);
						next(true);
					}, this);		
				} else {
					next();
				}		
			} else {
				next();
			}
		} else {
			next();
		}
	}
	var handleHTML = function(next, skipCompilation) {
		if(HTMLSource && skipCompilation !== true) {
			absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
				(function merge(e1, e2) {
					removeEmptyTextNodes(e1);
					removeEmptyTextNodes(e2);
					if(typeof e1 === 'undefined' || typeof e2 === 'undefined' || e1.isEqualNode(e2)) return;
					// replace the whole node
					if(e1.nodeName !== e2.nodeName) {
						if(e1.parentNode) {
							e1.parentNode.replaceChild(e2, e1);
						}
						return;
					}
					// nodeValue
					if(e1.nodeValue !== e2.nodeValue) {
						e1.nodeValue = e2.nodeValue;
					}
					// attributes
					if(e1.attributes) {
						var attr1 = e1.attributes, attr2 = e2.attributes, a1, a2, found = {};
						for(var i=0; i<attr1.length, a1=attr1[i]; i++) {
							for(var j=0; j<attr2.length, a2=attr2[j]; j++) {
								if(a1.name === a2.name) {
									e1.setAttribute(a1.name, a2.value);
									found[a1.name] = true;
								}
							}
							if(!found[a1.name]) {
								e1.removeAttribute(a1.name);
							}
						}
						for(var i=0; i<attr2.length, a2=attr2[i]; i++) {
							if(!found[a2.name]) {
								e1.setAttribute(a2.name, a2.value);
							}
						}
					}
					// childs
					if(e1.childNodes.length >= e2.childNodes.length) {
						for(var i=0; i<e1.childNodes.length; i++) {
							if(!e2.childNodes[i]) { e2.appendChild(document.createTextNode("")); }
							merge(e1.childNodes[i], e2.childNodes[i]);
						}
					} else {
						for(var i=0; i<e2.childNodes.length; i++) {
							e1.appendChild(document.createTextNode(""));						
							merge(e1.childNodes[i], e2.childNodes[i]);
						}
					}
				})(HTMLElement, str2DOMElement(html));
				next();
			}, this);
		} else {
			next();
		}
	}
	var handleAsyncFunctions = function(next) {
		if(HTMLElement) {
			var funcs = [];
			if(HTMLElement.hasAttribute("data-absurd-async")) {
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
							value = el.getAttribute("data-absurd-async");
						if(typeof self[async.funcs[value].name] === 'function') {							
							self[async.funcs[value].name].apply(self, [function(content) {
								el.parentNode.replaceChild(str2DOMElement(content), el);
								callFuncs();
							}].concat(async.funcs[value].args));
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
			if(HTMLElement.hasAttribute('data-absurd-event')) {
				registerEvent(HTMLElement);
			}
			var els = HTMLElement.querySelectorAll ? HTMLElement.querySelectorAll('[data-absurd-event]') : [];
			for(var i=0; i<els.length; i++) {
				registerEvent(els[i]);
			}
		}
		next();
	}
	var component = {
		name: name,
		populate: function(options) {
			queue([
				handleCSS,
				setHTMLSource,
				handleHTML,
				handleAsyncFunctions,
				append, 
				handleEvents,
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
		},
		el: function() {
			return HTMLElement;
		},
		set: function(key, value) {
			storage[key] = value;
			return this;
		},
		get: function(key) {
			return storage[key];
		},
		wire: function(event) {
			absurd.components.events.on(event, this[event] || function() {}, this);
		},
		async: function() {
			var args = Array.prototype.slice.call(arguments, 0),
				func = args.shift(),
				index = '_' + (async.index++);
			async.funcs[index] = {args: args, name: func};
			return '<span data-absurd-async="' + index + '"></span>';
		},
		children: function(map) {
			this.set("children", map);
		}
	}
	return component;
}