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