absurd.di.register('is', {
	appended: function(selector) {
		if(typeof selector == 'undefined') selector = this.host.html;
		return qs(selector) ? true : false;
	},
	hidden: function(el) {
		el = el || this.host.el;
		return el.offsetParent === null;
	}
});