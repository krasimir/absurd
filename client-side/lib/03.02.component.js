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
	var compileHTML = function(next) {
		if(this.html && typeof this.html === "string") {
			var element = select(this.html);
			if(element && element.length > 0) {	
				this.html = {'': element[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>')};
			}
		}
		if(this.html) {
			absurd.flush().morph("html").add(this.html).compile(function(err, html) {
				var element = str2DOMElement(html);				
			}, this);
		} else {
			next();
		}
	}
	return {
		populate: function() {
			queue([
				compileCSS,
				compileHTML,
				function() {
					this.dispatch("populated", {css: CSS, html: HTML});
				}
			], this);
		}
	}
}