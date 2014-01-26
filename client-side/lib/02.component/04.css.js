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
}