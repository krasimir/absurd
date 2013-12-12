var Observer = function() {
	var listeners = [];
	return {
		on: function(eventName, callback) {
			if(!listeners[eventName]) {
				listeners[eventName] = [];
			}
			listeners[eventName].push(callback);
			return this;
		},
		off: function(eventName, handler) {
			if(!listeners[eventName]) return this;
			if(!handler) listeners[eventName] = []; return this;
			var newArr = [];
			for(var i=0; i<listeners[eventName].length; i++) {
				if(listeners[eventName][i] !== handler) {
					newArr.push(listeners[eventName][i]);
				}
			}
			listeners[eventName] = newArr;
			return this;
		},
		dispatch: function(eventName, data) {
			if(listeners[eventName]) {
				for(var i=0; i<listeners[eventName].length; i++) {
					var callback = listeners[eventName][i];
					callback(data);
				}
			}
			if(this[eventName] && typeof this[eventName] === 'function') {
				this[eventName](data);
			}
			return this;
		}
	}
}