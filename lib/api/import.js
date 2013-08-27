module.exports = function(API) {
	return function(path) {
		if(typeof path == 'string') {
			require(path)(API);
		} else {
			for(var i=0; p=path[i]; i++) {
				require(p)(API);
			}
		}
		return API;
	}
}