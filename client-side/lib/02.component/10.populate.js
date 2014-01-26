api.populate = function(options) {	
	queue([
		api.__handleCSS,
		api.__handleHTML,
		api.__append, 
		api.__handleEvents,
		api.__handleAsyncFunctions,
		function() {
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