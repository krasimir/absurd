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