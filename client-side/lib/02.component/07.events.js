var cache = { events: {} };
api.__handleEvents = function(next) {		
	if(this.el) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			attrValue = attrValue.split(":");
			if(attrValue.length >= 2) {
				var eventType = attrValue[0];
				var methodName = attrValue[1];
				attrValue.splice(0, 2);
				var args = attrValue;
				if(!cache.events[eventType] || cache.events[eventType].indexOf(el) < 0) {
					if(!cache.events[eventType]) cache.events[eventType] = [];
					cache.events[eventType].push(el);
					addEventListener(el, eventType, function(e) {
						if(typeof self[methodName] === 'function') {
							var f = self[methodName];
							f.apply(self, [e].concat(args));
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