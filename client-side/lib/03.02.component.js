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
				// ...
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