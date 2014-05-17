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