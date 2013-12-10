var components = function(absurd) {
	var api = {},
		comps = {}

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
			_html: null,
			_css: null,
			_construct: function() {
				if(this.html && typeof this.html === 'string') {
					var element = select(this.html);
					if(element != null) {
						this.html = element.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
						this._html = {
							html: this.html,
							element: element
						}
					}
				}
			},
			_name: componentName,
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
			el: function() {
				return this._html && this._html.element ? this._html.element : null;
			},
			appendTo: function(selector) {
				var parent = select(selector);
				var el = this.el();
				parent && el ? parent.appendChild(el) : null;
				return this;
			},
			include: function(compName) {				
				return '<%' + compName + '%>';
			},
			populate: function(options) {

				var self = this;

				var handleCSS = function(css) {
					if(!self._css) {
						var style = document.createElement("style");
					    style.setAttribute("id", self._name + '-css');
					    style.setAttribute("type", "text/css");
					    style.innerHTML = css;
						select("head").appendChild(style);
						self._css = { css: css };
					} else if(self._css.css !== css) {
						select('#' + self._name + '-css').innerHTML = css;
					}
				}

				var handleHTML = function(html) {
					if(!self._html) {
						var el = str2DOMElement(html);
						self._html = { html: html, element: el };
					} else if(self._html.html !== html) {
						var newElement = str2DOMElement(html);
						if(self._html.element.parentNode) {
							self._html.element.parentNode.replaceChild(newElement, self._html.element);
						}
						self._html.element = newElement;
						self._html.html = html;
					}
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

				var handleComponentInclude = function(html, callback) {
					var re = /<%(.+?)%>/g, matches = 0;
					var callComponent = function(match) {
						var c = api.get(match[1]);
		                c.populate({callback: function(data) {
		                	var regexp = new RegExp(match[0], "g");
		                	html = html.replace(regexp, data.html);
		                	handleComponentInclude(html, callback);
		                	c._parent = self;
		                }, calledFromParent: true });
					}
					while(match = re.exec(html)) {
						matches++;
		                callComponent(match);
		                return;
			        }
			        callback(html);
				}

				// css & html
				absurd.flush().morph("component").add({css: this.css, html: this.html}).compile(function(err, css, html) {
					handleComponentInclude(html, function(html) {
						css != '' ? handleCSS(css) : null;
						html != '' ? handleHTML(html) : null;
						handleDataAttributes(self._html.element);
						if(options && options.appendTo) {
							self.appendTo(options.appendTo);
						}
						if(options && typeof options.callback === 'function') {
							options.callback(self._html);
						}
						self.dispatch("populated" , self._html);
					});
				}, api.extend({minify: true}, this));

				return this;
				
			}
		}
	}

	// components API
	api.register = function(name, comp) {
		var c = comps[name] = api.extend({}, Component(name), comp);
		c._construct();
		return c;
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
		return api;
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
	api.broadcast = function(event) {
		for(var name in comps) {
			comps[name].dispatch(event);
		}
		return api;
	}
	
	return api;
}