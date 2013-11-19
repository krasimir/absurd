module.exports = function(api) {
	return function(input, callback, options) {

		var css = "", html = "", all = [];

		var processCSS = function(clb) {
			api.flush();
			for(var i=0; i<all.length, component=all[i]; i++) {
				if(typeof component === "function") { component = component(); }
				api.add(component.css ? component.css : {});
			}
			api.compile(function(err, result) {
				css += result;
				clb(err);
			}, options)
		}
		var processHTML = function(clb) {
			var index = 0;
			var error = null;
			var processComponent = function() {
				if(index > input.length-1) {
					clb(error);
					return;
				}
				var c = input[index];
				if(typeof c === "function") { c = c(); }
				api.flush().morph("html").add(c.html ? c.html : {}).compile(function(err, result) {
					html += result;
					index += 1;
					error = err;
					processComponent();
				}, options);
			}
			processComponent();
		}
		var checkForNesting = function(o) {
			for(var key in o) {
				if(key === "_include") {
					if(o[key] instanceof Array) {
						for(var i=0; i<o[key].length, c=o[key][i]; i++) {
							if(typeof c === "function") { c = c(); }
							all.push(c);
							checkForNesting(c);
						}
					} else {
						if(typeof o[key] === "function") { o[key] = o[key](); }
						all.push(o[key]);
						checkForNesting(o[key]);
					}
				} else if(typeof o[key] === "object") {
					checkForNesting(o[key]);
				}
			}
		}

		// Convert the passed argument to an array.
		if(!(input instanceof Array)) {
			input = [input];
		}
		// Checking for nesting. I.e. collecting the css and html.
		for(var i=0; i<input.length, c=input[i]; i++) {
			if(typeof c === "function") { c = c(); }
			all.push(c);
			checkForNesting(c);
		}

		processCSS(function(errCSS) {
			processHTML(function(errHTML) {
				callback(
					errCSS || errHTML ? {error: {css: errCSS, html: errHTML }} : null,
					css,
					html
				)
			});
		});
		
	}
}