var Component = function(name, absurd) {
	var CSS = false, 
		HTMLSource = false, 
		HTMLElement = false,
		extend = lib.helpers.Extend,
		storage = {},
		appended = false,
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
				} else {
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
				}
				HTMLSource = {'': HTMLElement.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
				next();
			} else if(typeof this.html === 'object') {
				HTMLSource = extend({}, this.html);
				if(HTMLElement === false) {
					absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
						HTMLElement = str2DOMElement(html);
						next();
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
	var handleHTML = function(next) {
		if(HTMLSource) {			
			absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
				(function merge(e1, e2) {
					// console.log(e1, e2);
					if(typeof e1 === 'undefined' || typeof e2 === 'undefined') return;
					// replace the whole node
					if(e1.nodeName !== e2.nodeName) {
						if(e1.parentNode) {
							e1.parentNode.replaceChild(e2, e1);
						}
						next(); return;
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
					for(var i=0; i<e1.childNodes.length; i++) {
						merge(e1.childNodes[i], e2.childNodes[i]);
					}
				})(removeEmptyTextNodes(HTMLElement), removeEmptyTextNodes(str2DOMElement(html)));
				next();
			}, this);
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
	return {
		populate: function(options) {
			queue([
				handleCSS,
				setHTMLSource,
				handleHTML,
				append, 
				handleEvents,
				function() {
					var data = {css: CSS, html: { element: HTMLElement }};
					this.dispatch("populated", data);
					if(options && typeof options.callback === 'function') { options.callback(data); }
				}
			], this);
		},
		set: function(key, value) {
			storage[key] = value;
			return this;
		},
		get: function(key) {
			return storage[key];
		}
	}
}