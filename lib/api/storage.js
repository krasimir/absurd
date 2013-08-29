module.exports = function(API) {
	var _s = API.getStorage();
	var storage = function(name, value) {
		if(typeof value != "undefined") {
			_s[name] = value;
		} else {
			if(_s[name]) {
				return _s[name];
			} else {
				throw new Error("There is no data in the storage associated with '" + name + "'");
			}
		}
		return API;
	}
	return storage;
}