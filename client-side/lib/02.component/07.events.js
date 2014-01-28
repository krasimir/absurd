var cache = { events: {} };
api.__handleEvents = function(next) {		
	if(this.el) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			attrValue = attrValue.split(":");
			if(attrValue.length >= 2) {
				if(!cache.events[attrValue[0]] || cache.events[attrValue[0]].indexOf(el) < 0) {
					if(!cache.events[attrValue[0]]) cache.events[attrValue[0]] = [];
					cache.events[attrValue[0]].push(el);
					addEventListener(el, attrValue[0], function(e) {
						if(typeof self[attrValue[1]] === 'function') {
							attrValue.shift();
							var f = self[attrValue.shift()];
							f.apply(self, [e].concat(attrValue));
						}
					});
				}
			}
		}
		if(this.el.hasAttribute && this.el.hasAttribute('data-absurd-event')) {
			registerEvent(this.el);
		}
		var els = this.el.querySelectorAll ? this.el.querySelectorAll('[data-absurd-event]') : [];
		for(var i=0; i<els.length; i++) {
			registerEvent(els[i]);
		}
	}
	next();
	return this;
}	