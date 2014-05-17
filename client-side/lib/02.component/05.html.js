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