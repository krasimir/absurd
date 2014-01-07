var Observer = function(eventBus) {
	var listeners = [];
	return {
		listeners: listeners,
		on: function(eventName, callback, scope) {
			if(!listeners[eventName]) {
				listeners[eventName] = [];
			}
			listeners[eventName].push({callback: callback, scope: scope});
			return this;
		},
		off: function(eventName, handler) {
			if(!listeners[eventName]) return this;
			if(!handler) listeners[eventName] = []; return this;
			var newArr = [];
			for(var i=0; i<listeners[eventName].length; i++) {
				if(listeners[eventName][i].callback !== handler) {
					newArr.push(listeners[eventName][i]);
				}
			}
			listeners[eventName] = newArr;
			return this;
		},
		dispatch: function(eventName, data, scope) {
			if(data && typeof data === 'object') {
				if(!(data instanceof Array)) {
					data.target = this;
				} else {
					data = { target: this };
				}
			}
			if(listeners[eventName]) {
				for(var i=0; i<listeners[eventName].length; i++) {
					var callback = listeners[eventName][i].callback;
					callback.apply(scope || listeners[eventName][i].scope || {}, [data]);
				}
			}
			if(this[eventName] && typeof this[eventName] === 'function') {
				this[eventName](data);
			}
			if(eventBus) eventBus.dispatch(eventName, data);
			return this;
		}
	}
}