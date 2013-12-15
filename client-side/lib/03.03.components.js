var components = function(absurd) {
	var api = {}, comps = {}, extend = lib.helpers.Extend;

	api.register = function(name, cls) {
		return  comps[name] = extend({}, Observer(), Component(name, absurd), cls);
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
		return api;
	}
	api.broadcast = function(event) {
		for(var name in comps) {
			comps[name].dispatch(event);
		}
		return api;
	}

	return api;
}