var components = function(absurd) {
	var api = {},
		comps = {},
		cssCache = {},
		htmlCache = {};

	// utils
	var select = function(selector) {
		var result = document.querySelectorAll(selector);
		if(result.length === 1) { 
			return result[0]; 
		} else if(result.length === 0) {
			return null;
		} else { 
			return result; 
		}
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

	// A base class of the component
	var Component = function(componentName) {
		var listeners = [];
		return {
			name: componentName,
			on: function(eventName, callback) {
				if(!listeners[eventName]) {
					listeners[eventName] = [];
				}
				listeners[eventName].push(callback);
				return this;
			},
			off: function(eventName, handler) {
				if(!listeners[eventName]) return this;
				if(!handler) listeners[eventName] = []; return this;
				var newArr = [];
				for(var i=0; i<listeners[eventName].length; i++) {
					if(listeners[eventName][i] !== handler) {
						newArr.push(listeners[eventName][i]);
					}
				}
				listeners[eventName] = newArr;
				return this;
			},
			dispatch: function(eventName, data) {
				if(listeners[eventName]) {
					for(var i=0; i<listeners[eventName].length; i++) {
						var callback = listeners[eventName][i];
						callback(data);
					}
				}
				if(this[eventName] && typeof this[eventName] === 'function') {
					this[eventName](data);
				}
				return this;
			},
			render: function(selector, data) {
				var self = this,
					cssC = cssCache,
					htmlC = htmlCache;

				var handleCSS = function(css) {
					if(!cssC[self.name]) {
						var style = document.createElement("style");
					    style.setAttribute("id", self.name + '-css');
					    style.setAttribute("type", "text/css");
					    style.innerHTML = css;
						select("head").appendChild(style);
						cssC[self.name] = { css: css };
					} else if(cssC[self.name].css !== css) {
						select('#' + self.name + '-css').innerHTML = css;
					}
				}

				var handleHTML = function(html) {
					if(!htmlC[self.name]) {
						var el = str2DOMElement(html);
						select(selector).appendChild(el);
						htmlC[self.name] = { html: html, element: el };
					} else if(htmlC[self.name].html !== html) {
						var newElement = str2DOMElement(html);
						htmlC[self.name].element.parentNode.replaceChild(newElement, htmlC[self.name].element);
						htmlC[self.name].element = newElement;
					}
					handleDataAttributes(htmlC[self.name].element);
				}

				var handleDataAttributes = function(element) {
					var events = element.querySelectorAll('[data-absurd-event]');
					var handleEventAttribute = function(el) {
						var value = el.getAttribute("data-absurd-event");
						if(value !== null) {
							value = value.split(":");
							addEventListener(el, value[0], function() {
								if(typeof self[value[1]] === 'undefined') {
									throw new Error("There is no method with name '" + value[1] + "'.");
								} else {
									self[value[1]].call(self, arguments);
								}
							});
						}
					}
					for(var i=0; i<events.length, el=events[i]; i++) {
						handleEventAttribute(el);
					}
					handleEventAttribute(element);
				}

				// prepare HTML if it is already a DOM element
				if(this.html && typeof this.html === 'string' && !htmlC[this.name]) {
					var element = select(this.html);
					if(element != null) {
						this.html = element.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						htmlC[this.name] = {
							html: this.html,
							element: element,
							alreadyAddedDOM: true
						}
					}
				}

				// css & html
				absurd.flush().morph("component").add(this).compile(function(err, css, html) {
					css != '' ? handleCSS(css) : null;
					html != '' ? handleHTML(html) : null;
				}, api.extend({minify: true}, this));

				self.dispatch("rendered");
			}
		}
	}

	// components API
	api.register = function(name, comp) {
		return comps[name] = api.extend({}, Component(name), comp);
	}
	api.get = function(name) {
		if(comps[name]) { return comps[name]; }
		else { throw new Error("There is no component with name '" + name + "'."); }
	}
	api.remove = function(name) {
		if(comps[name]) { delete comps[name]; return true; }
		return false;
	}
	api.list = function() {
		var l = [];
		for(var name in comps) l.push(name);
		return l;
	}
	api.flush = function() {
		comps = {};
	}
	api.extend = function() {
		var process = function(destination, source) {	
		    for (var key in source) {
				if (hasOwnProperty.call(source, key)) {
				    destination[key] = source[key];
				}
		    }
		    return destination;
		};
		var result = arguments[0];
		for(var i=1; i<arguments.length; i++) {
			result = process(result, arguments[i]);
		}
		return result;
	}
	
	return api;
}