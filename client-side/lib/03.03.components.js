var components = function(absurd) {
	var api = {}, comps = {};

	api.register = function(name, cls) {
		return  comps[name] = extend({}, Observer(), Component(name, absurd), cls);
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
	api.broadcast = function(event) {
		for(var name in comps) {
			comps[name].dispatch(event);
		}
		return api;
	}

	return api;
}

/*
var components = function(absurd) {
	var api = {},
		comps = {};

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

	// A base class of the component
	var Component = function(componentName) {
		var listeners = [];
		return {
			_html: null,
			_css: null,
			_name: componentName,
			_appended: false,
			_construct: function() {

			},
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
			set: function(key, value) {
				this[key] = value;
				return this;
			},
			get: function(key) {
				return typeof this[key] != "undefined" ? this[key] : null;
			},
			populate: function(options) {
				queue([
					function(next) { // handle css
						if(this.css) {
							var self = this;
							absurd.flush().add(this.css).compile(function(err, css) {
								if(!self._css) {
									var style = document.createElement("style");
								    style.setAttribute("id", self._name + '-css');
								    style.setAttribute("type", "text/css");
								    style.innerHTML = css;
									select("head").appendChild(style);
									self._css = { raw: css };
								} else if(self._css.raw !== css) {
									select('#' + self._name + '-css').innerHTML = css;
									self._css.raw = css;
								}
								next();
							});
						} else {
							next();
						}
					},
					function(next) { // handle html
						var self = this;
						if(this.html && typeof this.html == "object") {
							absurd.flush().morph("html").add(this.html).compile(function(err, html) {
								if(!self._html) {
									var el = str2DOMElement(html);
									self._html = { raw: html, element: el };
								} else if(self._html.raw !== html) {
									self._html.newElement = str2DOMElement(html);
									self._html.raw = html;
								}
								next();
							}, this);
						} else if(this.html && typeof this.html == "string") {
							var element = select(this.html);
							if(element) {
								var outerHTML = element.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
								this._html = { element: element }
								this._appended = true;
								absurd.flush().morph("html").add(outerHTML).compile(function(err, html) {
									self._html.newElement = str2DOMElement(html);
									self._html.raw = html;
									next();
								}, this);
							} else {
								next();
							}
						} else {
							next();							
						}
					},
					function(next) { // adding the element to the DOM
						if(this._html && this._html.element) {
							var element = this._html.element;
							var newElement = this._html.newElement;
							if(this._appended) {
								if(newElement) {
									element.parentNode.replaceChild(newElement, element);	
								}								
							} else if(this.get("parent")) {
								var parent = this.get("parent");
								if(typeof parent === "string") parent = select(parent);
								if(parent) {
									parent.appendChild(newElement || element);
									this._appended = true;
								}
							}
							if(newElement) {
								this._html.element = newElement;
								delete this._html.newElement;
							}
						}
						next();
					},
					function(next) { // events handling
						if(this._html && this._html.element) {
							var element = this._html.element, self = this;							
							var events = select('[data-absurd-event]', true);
							var handleEventAttribute = function(el) {
								var value = el.getAttribute("data-absurd-event");
								if(value !== null) {
									value = value.split(":");
									if(value.length >= 3) {
										addEventListener(el, value[0], function() {
											if(typeof api.get(value[1])[value[2]] === 'undefined') {
												throw new Error("There is no method with name '" + value[2] + "' in '" + value[1] + "' component.");
											} else {
												api.get(value[1])[value[2]].call(value[1], arguments);
											}
										});
									}
								}
							}		
							if(events) {
								for(var i=0; i<events.length, el=events[i]; i++) {
									handleEventAttribute(el);
								}
							}
							handleEventAttribute(element);
							next();
						} else {
							next();
						}
					},
					function(next) { // finished
						var data = {
							css: this._css,
							html: this._html
						};
						this.dispatch("populated", data);
						if(options && typeof options.callback === 'function') options.callback(data);
					}
				], this);
			}
		}
	}

	// utils
	var select = function(selector, raw) {
		var result = document.querySelectorAll(selector);
		if(raw) return result;
		if(result.length == 1) {
			return result[0];
		} else if(result.length == 0) {
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
	var queue  = function(funcs, scope) {
		(function next() {
			funcs.length > 0 ? funcs.shift().apply(
				scope || {}, 
				[next].concat(Array.prototype.slice.call(arguments, 0))
			) : null;
		})();
	}
	
	return api;
}
*/