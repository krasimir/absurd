var Component = function(name, absurd) {
	var CSS = false, HTML = false;
	var compileCSS = function(next) {
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
	var prepareElement = function(next) {
		if(this.html) {
			if(HTML === false) {
				if(typeof this.html === 'string') {
					var element = select(this.html);
					if(element.length > 0) {
						HTML = { el : element[0] }
						next();
					} else {
						next();
					}
				} else if(typeof HTML === 'object') {
					absurd.flush().morph("html").add({'': this.html}).compile(function(err, html) {
						HTML = { el: str2DOMElement(html) }
						next();
					}, this);
				}
			} else {
				next();
			}
		} else {
			next();
		}
	}
	var prepareHTMLString = function(next) {
		if(HTML && HTML.el) {
			HTML.raw = HTML.el.outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}
		next();
	}
	var updateElement = function(next) {
		if(HTML && HTML.el && HTML.raw) {
			absurd.flush().morph("html").add({'': HTML.raw}).compile(function(err, html) {
				var assert = function(a, b) {
					console.log("-> ", a, b, a === b);
					return a === b;
				}
				var compare = function(source, el) {
					console.log("-------------", source, el);
					// comparing nodeName
					if(!assert(source.nodeName, el.nodeName)) {
						source.parentNode.replaceChild(el, source); return;
					}
					// attributes
					if(source.attributes) {
						var hashIt = function(arr) {
							var r = {}; for(var i=0; i<arr.length, a=arr[i]; i++) { r[a.name] = a.value; }; return r;
						},
						sAttrs = hashIt(source.attributes), eAttrs = hashIt(el.attributes);
						for(var sName in sAttrs) {
							var isThere = false;
							for(var eName in eAttrs) {
								if(assert(sName, eName)) {
									source.setAttribute(sName, eAttrs[eName]);
									eAttrs[eName] = false;
									isThere = true;
								}
							}
							if(!isThere) {
								source.removeAttribute(sName);
							}
						}
					}

					if(assert(source.innerText, el.nodeValue)) {
						
					}

					// childs
					var sNodes = source.childNodes;
					var eNodes = source.childNodes;
					if(assert(sNodes.length, eNodes.length)) {
						for(var i=0; i<sNodes.length; i++) {
					        compare(sNodes[i], eNodes[i]);
					    }
					}
				}
				compare(HTML.el, str2DOMElement(html));


				
				function recurseDomChildren(start) {
    				var nodes;
    				if(start.childNodes) {
        				nodes = start.childNodes;
        				var node;
					    for(var i=0;i<nodes.length;i++) {
					        node = nodes[i];
        					console.log(node);
					        if(node.childNodes) {
					            recurseDomChildren(node);
					        }
					    }
    				}
				}

				next();
			}, this);
		}
		next();
	}
	return {
		populate: function() {
			queue([
				compileCSS,
				prepareElement,
				prepareHTMLString,
				updateElement,
				function() {
					this.dispatch("populated", {css: CSS, html: HTML});
				}
			], this);
		}
	}
}