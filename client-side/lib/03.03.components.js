var component = function(api) {
	return function(name, cls) {
		if(typeof cls == 'undefined') {
			return api.components.get(name);
		} else {
			return api.components.register(name, cls);
		}
	}
}
var components = function(absurd) {
	var extend = lib.helpers.Extend,
		api = {}, 
		comps = {}, 
		instances = [];

	api.events = extend({}, Observer());

	api.register = function(name, cls) {
		return comps[name] = function() {
			var c = extend({}, Observer(api.events), Component(name, absurd), cls);
			absurd.di.resolveObject(c);
			instances.push(c);
			if(typeof c.constructor === 'function') {
				c.constructor.apply(c, Array.prototype.slice.call(arguments, 0));
			}
			return c;
		};
	}
	api.get = function(name) {
		if(comps[name]) { return comps[name]; }
		else { throw new Error("There is no component with name '" + name + "'."); }
	}
	api.remove = function(name) {
		if(comps[name]) { delete comps[name]; return true; }
		return false;
	}
	api.list = function() {
		var l = [];
		for(var name in comps) l.push(name);
		return l;
	}
	api.flush = function() {
		comps = {};
		instances = [];
		return api;
	}
	api.broadcast = function(event, data) {
		for(var i=0; i<instances.length, instance=instances[i]; i++) {
			if(typeof instance[event] === 'function') {
				instance[event](data);
			}
		}
		return api;
	}

	return api;
}