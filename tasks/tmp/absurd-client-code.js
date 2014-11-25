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
    } else if(v == './helpers/TemplateEngine' || v == '../html/helpers/TemplateEngine') {
        return lib.processors.html.helpers.TemplateEngine;
    } else if(v == '../helpers/Extend') {
        return lib.helpers.Extend;
    } else if(v == '../helpers/Clone') {
        return lib.helpers.Clone;
    } else if(v == '../helpers/Prefixes' || v == '/../../../helpers/Prefixes') {
        return lib.helpers.Prefixes;
    } else if(v == __dirname + '/../../../../') {
        return Absurd;
    } else if(v == '../helpers/CSSParse') {
        return lib.helpers.CSSParse;
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
var str2DOMElement = function(html) {
   var wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        body: [0, "", ""],
        _default: [ 1, "<div>", "</div>"  ]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if(match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if(tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for(var i=0; i<attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default, element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0]+1;
            while(j--) {
                element = element.lastChild;
            }
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
var qs = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelector(selector);
};
var qsa = function(selector, parent) {
    if(parent === false) { parent = document; }
    else { parent = parent || this.el || document; }
    return parent.querySelectorAll(selector);
};
var getStyle = function(styleProp, el) {
    el = el || this.el;
    if(el && el.currentStyle) {
        return el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    }
    return null;
};
var addClass = function(className, el) {
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
    return this;
};
var removeClass = function(className, el) {
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
    return this;
}
var replaceClass = function(classNameA, classNameB, el) {
    el = el || this.el;
    var current = el.className.split(' '), found = false;
    for(var i=0; i<current.length; i++) {
        if(current[i] == classNameA) {
            found = true;
            current[i] = classNameB;
        }
    }
    if(!found) {
        return addClass(classNameB, el);
    }
    el.className = current.join(' ');
    return this;
}
var toggleClass = function(className, el) {
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
    return this;
}
var bind = function(func, scope, args) {
    if(scope instanceof Array) { args = scope; scope = this; }
    if(!scope) scope = this;
    return function() {
        func.apply(scope, (args || []).concat(Array.prototype.slice.call(arguments, 0)));
    }
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
		absurd.flush().morph('dynamic-css').add(this.css).compile(function(err, css) {
			if(!CSS) {
				var style = createNode(
					'style', [
						{ name: "id", value: componentName + '-css' },
						{ name: "type", value: "text/css"}
					],
					 css
				);
				(qs("head") || qs("body")).appendChild(style);
				CSS = { raw: css, element: style };
			} else if(CSS.raw !== css) {
				CSS.raw = css;
				CSS.element.innerHTML = css;
			}
			next();
		}, this);
	} else {
		next();
	}
	return this;
};
api.applyCSS = function(data, preventComposition, skipAutoPopulation) {
	if(this.html && typeof this.html === 'string' && !preventComposition) {
		var res = {};
		res[this.html] = data;
		data = res;
	}
	this.css = data;
	if(!skipAutoPopulation) {
		this.populate();
	}
	return this;
};
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
					if(a1.name === 'value') {
						e1.value = a2.value;
					}
				}
			}
			if(!found[a1.name]) {
				e1.removeAttribute(a1.name);
			}
		}
		for(var i=0; i<attr2.length, a2=attr2[i]; i++) {
			if(!found[a2.name]) {
				e1.setAttribute(a2.name, a2.value);
				if(a2.name === 'value') {
					e1.value = a2.value;
				}
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
				var element = qs(this.html);
				if(element) {
					this.el = element;
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
api.applyHTML = function(data, skipAutoPopulation) {
	this.html = data;
	if(!skipAutoPopulation) {
		this.populate();
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
			var processAttributes = function(attrValue) {
				attrValue = attrValue.split(":");
				if(attrValue.length >= 2) {
					var eventType = attrValue[0];
					var methodName = attrValue[1];
					attrValue.splice(0, 2);
					var args = attrValue;
					if(!cache.events[eventType] || cache.events[eventType].indexOf(el) < 0) {
						if(!cache.events[eventType]) cache.events[eventType] = [];
						cache.events[eventType].push(el);
						addEventListener(el, eventType, function(e) {
							if(typeof self[methodName] === 'function') {
								var f = self[methodName];
								f.apply(self, [e].concat(args));
							}
						});
					}
				}
			}
			attrValue = attrValue.split(/, ?/g);
			for(var i=0; i<attrValue.length; i++) processAttributes(attrValue[i]);
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
api.__getAnimAndTransEndEventName = function(el) {
	if(!el) return;
    var a;
    var animations = {
      'animation': ['animationend', 'transitionend'],
      'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
      'MozAnimation': ['animationend', 'transitionend'],
      'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
    }
    for(a in animations){
        if( el.style[a] !== undefined ){
            return animations[a];
        }
    }
}
api.onAnimationEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[0], function(e) {
		func.apply(self, [e]);
	});
}
api.onTransitionEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[1], function(e) {
		func.apply(self, [e]);
	});
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
var isPopulateInProgress = false;
api.populate = function(options) {
	if(isPopulateInProgress) return;
	isPopulateInProgress = true;
	var empty = function(next) { next(); return this; };
	queue([
		options && options.css === false ? empty : api.__handleCSS,
		options && options.html === false ? empty : api.__handleHTML,
		api.__append, 
		api.__handleEvents,
		api.__handleAsyncFunctions,
		function() {
			isPopulateInProgress = false;
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
api.qs = qs;
api.qsa = qsa;
api.getStyle = getStyle;
api.addClass = addClass;
api.removeClass = removeClass;
api.replaceClass = replaceClass;
api.bind = bind;
api.toggleClass = toggleClass;
api.compileHTML = function(HTML, callback, data) {
	absurd.flush().morph("html").add(HTML).compile(callback, data);
};
api.compileCSS = function(CSS, callback, options) {
	absurd.flush().add(CSS).compile(callback, options);
};
api.delay = function(time, fn, args) {
	var self = this;
	setTimeout(function() {
		fn.apply(self, args);
	}, time);
}
	return api;
};
var injecting = function(absurd) {
absurd.di.register('is', {
	appended: function(selector) {
		if(typeof selector == 'undefined') selector = this.host.html;
		return qs(selector) ? true : false;
	},
	hidden: function(el) {
		el = el || this.host.el;
		return el.offsetParent === null;
	}
});
absurd.di.register('router', {
	routes: [],
	mode: null,
	root: '/',
	getFragment: function() {
		var fragment = '';
		if(this.mode === 'history') {
			if(!location) return '';
			fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
			fragment = fragment.replace(/\?(.*)$/, '');
			fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
		} else {
			if(!window) return '';
			var match = window.location.href.match(/#(.*)$/);
			fragment = match ? match[1] : '';
		}
		return this.clearSlashes(fragment);
	},
    clearSlashes: function(path) {
    	return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
	add: function(re, handler) {
		if(typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({ re: re, handler: handler});
		return this;
	},
	remove: function(param) {
		for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
			if(r.handler === param || r.re === param) {
				this.routes.splice(i, 1); 
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.mode = null;
		this.root = '/';
		return this;
	},
	config: function(options) {
		this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	listen: function(loopInterval) {
		var self = this;
		var current = self.getFragment();
		var fn = function() {
			if(current !== self.getFragment()) {
				current = self.getFragment();
				self.check(current);
			}
		}
		clearInterval(this.interval);
		this.interval = setInterval(fn, loopInterval || 50);
		return this;
	},
	check: function(f) {
		var fragment = f || this.getFragment();
		for(var i=0; i<this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if(match) {
				match.shift();
				this.routes[i].handler.apply(this.host || {}, match);
				return this;
			}			
		}
		return this;
	},
	navigate: function(path) {
		path = path ? path : '';
		if(this.mode === 'history') {
			history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href.match(/#(.*)$/);
			window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
		}
		return this;
	}
});
absurd.di.register('ajax', {
	request: function(ops) {

		if(typeof ops == 'string') ops = { url: ops };
		ops.url = ops.url || '';
		ops.method = ops.method || 'get'
		ops.data = ops.data || {};

		var getParams = function(data, url) {
			var arr = [], str;
			for(var name in data) {
				arr.push(name + '=' + encodeURIComponent(data[name]));
			}
			str = arr.join('&');
			if(str != '') {
				return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
			}
			return '';
		}

		var api = {
			host: this.host || {},
			process: function(ops) {
				var self = this;
				this.xhr = null;
				if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
				else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
				if(this.xhr) {
					this.xhr.onreadystatechange = function() {
						if(self.xhr.readyState == 4 && self.xhr.status == 200) {
							var result = self.xhr.responseText;
							if(ops.json === true && typeof JSON != 'undefined') {
								result = JSON.parse(result);
							}
							self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
						} else if(self.xhr.readyState == 4) {
							self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
						}
						self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
					}
					
					if(ops.method == 'get') {
						this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
					} else {
						this.xhr.open(ops.method, ops.url, true);
						this.setHeaders({
							'X-Requested-With': 'XMLHttpRequest',
							'Content-type': 'application/x-www-form-urlencoded'
						});
					}
					if(ops.headers && typeof ops.headers == 'object') {
						this.setHeaders(ops.headers);
					}		
					setTimeout(function() { 
						ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
					}, 20);	
				}
				return this;
			},
			done: function(callback) {
				this.doneCallback = callback;
				return this;
			},
			fail: function(callback) {
				this.failCallback = callback;
				return this;
			},
			always: function(callback) {
				this.alwaysCallback = callback;
				return this;
			},
			setHeaders: function(headers) {
				for(var name in headers) {
					this.xhr && this.xhr.setRequestHeader(name, headers[name]);
				}
			}
		}

		return api.process(ops);

	}
});
var dom = function(el, parent) {
	var host = dom.prototype.host;
	var api = { el: null };
	// defining the scope
	switch(typeof el) {
		case 'undefined':
			api.el = host.el;
		break;
		case 'string':
			parent = parent && typeof parent === 'string' ? qs.apply(host, [parent]) : parent;
			api.el = qs(el, parent || host.el || document);
		break;
		case 'object': 
			if(typeof el.nodeName != 'undefined') {
	            api.el = el;
	        } else {
	        	var loop = function(value, obj) {
            		obj = obj || this;
            		for(var prop in obj) {
        				if(typeof obj[prop].el != 'undefined') {
        					obj[prop] = obj[prop].val(value);
        				} else if(typeof obj[prop] == 'object') {
        					obj[prop] = loop(value, obj[prop]);
        				}
            		}
            		delete obj.val;
            		return obj;
	        	}
	            var res = { val: loop };
	            for(var key in el) {
	                res[key] = dom.apply(this, [el[key]]);
	            }
	            return res;
	        }
		break;
	}
	// getting or setting a value
	api.val = function(value) {
		if(!this.el) return null;
		var set = !!value;
		var useValueProperty = function(value) {
			if(set) { this.el.value = value; return api; }
			else { return this.el.value; }
		}
        switch(this.el.nodeName.toLowerCase()) {
        	case 'input':
        		var type = this.el.getAttribute('type');
        		if(type == 'radio' || type == 'checkbox') {
	                var els = qsa('[name="' + this.el.getAttribute('name') + '"]', parent);
	                var values = [];
	                for(var i=0; i<els.length; i++) {
	                    if(set && els[i].checked && els[i].value !== value) {
	                        els[i].removeAttribute('checked');
	                    } else if(set && els[i].value === value) {
	                    	els[i].setAttribute('checked', 'checked');
	                    	els[i].checked = 'checked';
	                    } else if(els[i].checked) {
	                    	values.push(els[i].value);
	                    }
	                }
	                if(!set) { return type == 'radio' ? values[0] : values; }
	            } else {
	            	return useValueProperty.apply(this, [value]);
	            }
        	break;
        	case 'textarea': return useValueProperty.apply(this, [value]); break;
        	case 'select':
        		if(set) {
            		var options = qsa('option', this.el);
            		for(var i=0; i<options.length; i++) {
            			if(options[i].getAttribute('value') === value) {
            				this.el.selectedIndex = i;
            			} else {
            				options[i].removeAttribute('selected');
            			}
            		}
            	} else {
                	return this.el.value;
            	}
        	break;
        	default: 
        		if(set) {
        			this.el.innerHTML = value;
        		} else {
	        		if(typeof this.el.textContent != 'undefined') {
		                return this.el.textContent;
		            } else if(typeof this.el.innerText != 'undefined') {
		                return typeof this.el.innerText;
		            } else {
		                return this.el.innerHTML;
		            }
	        	}
        	break;
        }
        return set ? api : null;
	}
	// chaining dom module
	api.dom = function(el, parent) {
		return dom(el, parent || api.el);
	}
	return api;
}
absurd.di.register('dom', dom);
var mq = function(query, callback, usePolyfill) {
	var host = mq.prototype.host;
	var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;
	if(isMatchMediaSupported) {
		var res = window.matchMedia(query);
		callback.apply(host, [res.matches, res.media]);
		res.addListener(function(changed) {
			callback.apply(host, [changed.matches, changed.media]);
		});
	} else {
		var id = ".match-media-" + absurd.components.numOfComponents;
		var css = {}, html = {};
		css[id] = { display: 'block' };
		css[id]['@media ' + query] = { display: 'none' };
		html['span' + id] = '';
		absurd.component(id + '-component', {
			css: css,
			html: html,
			intervaliTime: 30,
			status: '',
			loop: function(dom) {
				var self = this;
				if(this.el) {
					var d = this.getStyle('display');
					if(this.status != d) {
						this.status = d;
						callback.apply(host, [d === 'none'])
					}
				}
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			},
			constructor: ['dom', function(dom) {
				var self = this;
				this.set('parent', dom('body').el).populate();
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			}]
		})();
	}
};
absurd.di.register('mq', mq);
}
var client = function() {
	return function(arg) {

		/******************************************* Copied directly from /lib/API.js */

		var extend = function(destination, source) {
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
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
		_api['import'] = function() { 
			if(_api.callHooks("import", arguments)) return _api;
			return _api; 
		}
		_api.handlecss = function(parsed, path) {
			var plugins = _api.getPlugins();
			if(parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
				var rules = parsed.stylesheet.rules;
				for(var i=0; rule=rules[i]; i++) {
					switch(rule.type) {
						case "rule": _api.handlecssrule(rule); break;
						case "import": _api.handlecssimport(rule, path); break;
						default:
							if(plugins[rule.type]) {
								plugins[rule.type](_api, rule);
							}
						break;
					}
				}
			}
			return _api;
		}
		_api.handlecssimport = function(rule, cssPath) {
			return _api;
		}
		_api.handlecssrule = function(rule, stylesheet) {		
			var absurdObj = {}, absurdProps = {};
			if(rule.declarations && rule.declarations.length > 0) {
				for(var i=0; decl=rule.declarations[i]; i++) {
					if(decl.type === "declaration") {
						absurdProps[decl.property] = decl.value;
					}
				}
				// absurdObj[rule.selectors.join(", ")] = absurdProps;
				if(rule.selectors && rule.selectors.length > 0) {
					for(var i=0; selector=rule.selectors[i]; i++) {
						absurdObj[selector] = extend({}, absurdProps);
					}
				}
				_api.add(absurdObj, stylesheet);
			}
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
				events = extend({}, Component()),
				exports = {};

			(function(fn) {
				if(!window) return;
				if (window.addEventListener) {
					window.addEventListener('load', fn);
				} else if(window.attachEvent) {
					window.attachEvent('onload', fn);
				}
			})(function() {
				exports.broadcast("ready");
			})

			return exports = {
				numOfComponents: 0,
				events: events,
				register: function(name, cls) {
					this.numOfComponents += 1;
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
		injecting(_api);

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
			var res = options.processor(
				_api.getRules(),
				callback || function() {},
				options
			);
			_api.flush();
			return res;
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

		// attaching utils functions
		_api.utils = {
			str2DOMElement: str2DOMElement
		}

		return _api;

	}
};