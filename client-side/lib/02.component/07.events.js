var cache = { events: {} };
api.__handleEvents = function(next) {		
	if(this.el) {
		var self = this;
		var registerEvent = function(el) {
			var attrValue = el.getAttribute('data-absurd-event');
			var processAttributes = function(attrValue) {
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
			attrValue = attrValue.split(/, ?/g);
			for(var i=0; i<attrValue.length; i++) processAttributes(attrValue[i]);
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
api.__getAnimAndTransEndEventName = function(el) {
	if(!el) return;
    var a;
    var animations = {
      'animation': ['animationend', 'transitionend'],
      'OAnimation': ['oAnimationEnd', 'oTransitionEnd'],
      'MozAnimation': ['animationend', 'transitionend'],
      'WebkitAnimation': ['webkitAnimationEnd', 'webkitTransitionEnd']
    }
    for(a in animations){
        if( el.style[a] !== undefined ){
            return animations[a];
        }
    }
}
api.onAnimationEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[0], function(e) {
		func.apply(self, [e]);
	});
}
api.onTransitionEnd = function(el, func) {
	if(arguments.length == 1) {
		func = el;
		el = this.el;
	}
	var self = this;
	var eventName = api.__getAnimAndTransEndEventName(el);
	if(!eventName) { func.apply(this, [{error: 'Animations not supported.'}]); return; };
	this.addEventListener(el, eventName[1], function(e) {
		func.apply(self, [e]);
	});
}