var l = [];
api.listeners = l;
api.on = function(eventName, callback, scope) {
	if(!l[eventName]) {
		l[eventName] = [];
	}
	l[eventName].push({callback: callback, scope: scope});
	return this;
};
api.off = function(eventName, handler) {
	if(!l[eventName]) return this;
	if(!handler) l[eventName] = []; return this;
	var newArr = [];
	for(var i=0; i<l[eventName].length; i++) {
		if(l[eventName][i].callback !== handler) {
			newArr.push(l[eventName][i]);
		}
	}
	l[eventName] = newArr;
	return this;
};
api.dispatch = function(eventName, data, scope) {
	if(data && typeof data === 'object' && !(data instanceof Array)) {
		data.target = this;
	}
	if(l[eventName]) {
		for(var i=0; i<l[eventName].length; i++) {
			var callback = l[eventName][i].callback;
			callback.apply(scope || l[eventName][i].scope || {}, [data]);
		}
	}
	if(this[eventName] && typeof this[eventName] === 'function') {
		this[eventName](data);
	}
	if(eventBus) eventBus.dispatch(eventName, data);
	return this;
};