var mq = function(query, callback, usePolyfill) {
	var host = mq.prototype.host;
	var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;
	if(isMatchMediaSupported) {
		var res = window.matchMedia(query);
		callback.apply(host, [res.matches, res.media]);
		res.addListener(function(changed) {
			callback.apply(host, [changed.matches, changed.media]);
		});
	} else {
		var id = ".match-media-" + absurd.components.numOfComponents;
		var css = {}, html = {};
		css[id] = { display: 'block' };
		css[id]['@media ' + query] = { display: 'none' };
		html['span' + id] = '';
		absurd.component(id + '-component', {
			css: css,
			html: html,
			intervaliTime: 30,
			status: '',
			loop: function(dom) {
				var self = this;
				if(this.el) {
					var d = this.getStyle('display');
					if(this.status != d) {
						this.status = d;
						callback.apply(host, [d === 'none'])
					}
				}
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			},
			constructor: ['dom', function(dom) {
				var self = this;
				this.set('parent', dom('body').el).populate();
				setTimeout(function() { self.loop(); }, this.intervaliTime);
			}]
		})();
	}
};
absurd.di.register('mq', mq);