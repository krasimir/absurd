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
var require = function(v) {
    // css preprocessor
    if(v.indexOf('css/CSS.js') > 0 || v == '/../CSS.js') {
        return lib.processors.css.CSS;
    } else if(v.indexOf('html/HTML.js') > 0) {
        return lib.processors.html.HTML;
    } else if(v.indexOf('component/Component.js') > 0) {
        return lib.processors.component.Component;
    } else if(v == 'js-beautify') {
        return { 
            html: function(html) {
                return html;
            }
        }
    } else if(v == './helpers/PropAnalyzer') {
        return lib.processors.html.helpers.PropAnalyzer;
    } else if(v == '../../helpers/TransformUppercase') {
        return lib.helpers.TransformUppercase;
    } else if(v == './helpers/TemplateEngine') {
        return lib.processors.html.helpers.TemplateEngine;
    } else if(v == '../helpers/Extend') {
        return lib.helpers.Extend;
    } else if(v == '../helpers/Clone') {
        return lib.helpers.Clone;
    } else if(v == '../helpers/Prefixes' || v == '/../../../helpers/Prefixes') {
        return lib.helpers.Prefixes;
    } else {
        return function() {}
    }
};
var __dirname = "";
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
    /* code taken from jQuery */
   var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

        // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
        // unless wrapped in a div with non-breaking characters in front of it.
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var element = document.createElement('div');
    var match = /<\s*\w.*?>/g.exec(html);
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '');
        var map = wrapMap[tag] || wrapMap._default, element;
        html = map[1] + html + map[2];
        element.innerHTML = html;
        // Descend through wrappers to the right content
        var j = map[0]+1;
        while(j--) {
            element = element.lastChild;
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
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
var createNode = function(type, attrs, content) {
	var node = document.createElement(type);
	for(var i=0; i<attrs.length, a=attrs[i]; i++) {
		node.setAttribute(a.name, a.value);
	}
	node.innerHTML = content;
	return node;
}
var Component = function(componentName, absurd, eventBus, cls) {
	var api = lib.helpers.Extend({
		__name: componentName
	}, cls);
	var extend = lib.helpers.Extend;
var l = [];
api.listeners = l;
api.on = function(eventName, callback, scope) {
	if(!l[eventName]) {
		l[eventName] = [];
	}
	l[eventName].push({callback: callback, scope: scope});
	return this;
};
api.off = function(eventName, handler) {
	if(!l[eventName]) return this;
	if(!handler) l[eventName] = []; return this;
	var newArr = [];
	for(var i=0; i<l[eventName].length; i++) {
		if(l[eventName][i].callback !== handler) {
			newArr.push(l[eventName][i]);
		}
	}
	l[eventName] = newArr;
	return this;
};
api.dispatch = function(eventName, data, scope) {
	if(data && typeof data === 'object' && !(data instanceof Array)) {
		data.target = this;
	}
	if(l[eventName]) {
		for(var i=0; i<l[eventName].length; i++) {
			var callback = l[eventName][i].callback;
			callback.apply(scope || l[eventName][i].scope || {}, [data]);
		}
	}
	if(this[eventName] && typeof this[eventName] === 'function') {
		this[eventName](data);
	}
	if(eventBus) eventBus.dispatch(eventName, data);
	return this;
};
var storage = {};
api.set = function(key, value) {
	storage[key] = value;
	return this;
};
api.get = function(key) {
	return storage[key];
};
var CSS = false;
api.__handleCSS = function(next) {
	if(this.css) {
		absurd.flush().add(this.css).compile(function(err, css) {
			if(!CSS) {
				var style = createNode(
					'style', [
						{ name: "id", value: componentName + '-css' },
						{ name: "type", value: "text/css"}
					],
					 css
				);
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
	return this;
}
var HTMLSource = false;

api.__mergeDOMElements = function(e1, e2) {	
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
	var newNodesToMerge = [];
	if(e1.childNodes.length >= e2.childNodes.length) {
		for(var i=0; i<e1.childNodes.length; i++) {
			if(!e2.childNodes[i]) { e2.appendChild(document.createTextNode("")); }
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	} else {
		for(var i=0; i<e2.childNodes.length; i++) {
			e1.appendChild(document.createTextNode(""));						
			newNodesToMerge.push([e1.childNodes[i], e2.childNodes[i]]);
		}
	}
	for(var i=0; i<newNodesToMerge.length; i++) {
		api.__mergeDOMElements(newNodesToMerge[i][0], newNodesToMerge[i][1]);
	}
};
api.__handleHTML = function(next) {
	var self = this;
	var compile = function() {
		absurd.flush().morph("html").add(HTMLSource).compile(function(err, html) {
			if(!self.el) {
				self.el = str2DOMElement(html);
			} else {
				api.__mergeDOMElements(self.el, str2DOMElement(html));
			}
			next();
		}, self);
	}
	if(this.html) {
		if(typeof this.html === 'string') {
			if(!this.el) {
				var element = select(this.html);
				if(element.length > 0) {
					this.el = element[0];
					HTMLSource = {'': this.el.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
				}
			}
			compile();
		} else if(typeof this.html === 'object') {
			HTMLSource = extend({}, this.html);
			compile();		
		} else {
			next();
		}
	} else {
		next();
	}
	return this;
};
var	appended = false
api.__append = function(next) {
	if(!appended && this.el && this.get("parent")) {
		appended = true;
		this.get("parent").appendChild(this.el);
	}
	next();
	return this;
}
var cache = { events: {} };
api.__handleEvents = function(next) {		
	if(this.el) {
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
		if(this.el.hasAttribute && this.el.hasAttribute('data-absurd-event')) {
			registerEvent(this.el);
		}
		var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-event]') : [];
		for(var i=0; i<els.length; i++) {
			registerEvent(els[i]);
		}
	}
	next();
	return this;
}	
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
api.wire = function(event) {
	absurd.components.events.on(event, this[event] || function() {}, this);
	return this;
};
api.populate = function(options) {	
	queue([
		api.__handleCSS,
		api.__handleHTML,
		api.__append, 
		api.__handleEvents,
		api.__handleAsyncFunctions,
		function() {
			async = { funcs: {}, index: 0 }
			var data = {
				css: CSS, 
				html: { 
					element: this.el 
				}
			};
			this.dispatch("populated", data);
			if(options && typeof options.callback === 'function') { options.callback(data); }	
		}
	], this);
	return this;
};
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
	return api;
};
var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (hasOwnProperty.call(source, key)) {
					destination[key] = source[key];
				}
			}
			return destination;
		};

		var _api = { 
				defaultProcessor: lib.processors.css.CSS() 
			},
			_rules = {},
			_storage = {},
			_plugins = {},
			_hooks = {};

		_api.getRules = function(stylesheet) {
			if(typeof stylesheet === 'undefined') {
				return _rules;
			} else {
				if(typeof _rules[stylesheet] === 'undefined') {
					_rules[stylesheet] = [];
				}
				return _rules[stylesheet];
			}
		}
		_api.getPlugins = function() {
			return _plugins;		
		}
		_api.getStorage = function() {
			return _storage;
		}
		_api.flush = function() {
			_rules = {};
			_storage = [];
			_hooks = {};
			_api.defaultProcessor = lib.processors.css.CSS();
			return _api;
		}
		_api.import = function() { 
			if(_api.callHooks("import", arguments)) return _api;
			return _api; 
		}

		// hooks
		_api.addHook = function(method, callback) {
			if(!_hooks[method]) _hooks[method] = [];
			var isAlreadyAdded = false;
			for(var i=0; c=_hooks[method][i]; i++) {
				if(c === callback) {
					isAlreadyAdded = true;
				}
			}
			isAlreadyAdded === false ? _hooks[method].push(callback) : null;
		}
		_api.callHooks = function(method, args) {
			if(_hooks[method]) {
				for(var i=0; c=_hooks[method][i]; i++) {
					if(c.apply(_api, args) === true) return true;
				}
			}
			return false;
		}

		// internal variables
		_api.numOfAddedRules = 0;

		// absurd.components API
		_api.components = (function(api) {
			var extend = lib.helpers.Extend,
				clone = lib.helpers.Clone,
				comps = {}, 
				instances = [],
				events = extend({}, Component());
			return {
				events: events,
				register: function(name, cls) {
					return comps[name] = function() {
						var c = extend({}, Component(name, api, events, clone(cls)));
						api.di.resolveObject(c);
						instances.push(c);
						if(typeof c.constructor === 'function') {
							c.constructor.apply(c, Array.prototype.slice.call(arguments, 0));
						}
						return c;
					};
				},
				get: function(name) {
					if(comps[name]) { return comps[name]; }
					else { throw new Error("There is no component with name '" + name + "'."); }
				},
				remove: function(name) {
					if(comps[name]) { delete comps[name]; return true; }
					return false;
				},
				list: function() {
					var l = [];
					for(var name in comps) l.push(name);
					return l;
				},
				flush: function() {
					comps = {};
					instances = [];
					return this;
				},
				broadcast: function(event, data) {
					for(var i=0; i<instances.length, instance=instances[i]; i++) {
						if(typeof instance[event] === 'function') {
							instance[event](data);
						}
					}
					return this;
				}
			}
		})(_api);

		// absurd.component shortcut
		_api.component = (function(api) {
			return function(name, cls) {
				if(typeof cls == 'undefined') {
					return api.components.get(name);
				} else {
					return api.components.register(name, cls);
				}
			}
		})(_api);

		// dependency injector
		_api.di = lib.DI(_api);

		/******************************************* Copied directly from /lib/API.js */

		// client side specific methods 
		_api.compile = function(callback, options) {
			if(_api.callHooks("compile", arguments)) return _api;
			var defaultOptions = {
				combineSelectors: true,
				minify: false,
				processor: _api.defaultProcessor,
				keepCamelCase: false,
				api: _api
			};
			options = extend(defaultOptions, options || {});
			options.processor(
				_api.getRules(),
				callback || function() {},
				options
			);
			_api.flush();
		}

		// registering api methods
		for(var method in lib.api) {
			if(method !== "compile") {
				_api[method] = lib.api[method](_api);
				_api[method] = (function(method) {
					return function() {
						var f = lib.api[method](_api);
						if(_api.callHooks(method, arguments)) return _api;
						return f.apply(_api, arguments);
					}
				})(method);		
			}
		}

		// registering plugins
		for(var pluginName in lib.processors.css.plugins) {
			_api.plugin(pluginName, lib.processors.css.plugins[pluginName]());
		}

		// accept function
		if(typeof arg === "function") {
			arg(_api);
		}

		// check for Organic
		if(typeof Organic != 'undefined') {
			Organic.init(_api);
		}

		return _api;

	}
};