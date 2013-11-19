module.exports = function(api) {
	return function(component, callback, options) {

		var css = "", html = "";

		if(!(component instanceof Array)) {
			component = [component];
		}

		var processCSS = function(clb) {
			api.flush();
			for(var i=0; i<component.length, c=component[i]; i++) {
				if(typeof c === "function") { c = c(); }
				api.add(c.css ? c.css : {});
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
				if(index > component.length-1) {
					clb(error);
					return;
				}
				var c = component[index];
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

		processCSS(function(errCSS) {
			processHTML(function(errHTML) {
				callback(
					errCSS || errHTML ? {error: {css: errCSS, html: errHTML }} : null,
					css,
					html
				)
			});
		})
		
	}
}