var requireUncached = require('../helpers/RequireUncached.js');
module.exports = function(API) {
	return function(path) {
		if(typeof path == 'string') {
			try {
				requireUncached(path)(API)
			} catch(err) {
				console.log("Error: I can't find '" + path + "'.");
			}
		} else {
			for(var i=0; p=path[i]; i++) {
				try {
					requireUncached(p)(API);
				} catch(err) {
					console.log("Error: I can't find '" + p + "'.");
				}
			}
		}
		return API;
	}
}