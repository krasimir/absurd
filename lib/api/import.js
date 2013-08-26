module.exports = function(API) {
	return function(path) {
		if(typeof path == 'string') {
			require(path);
		} else {
			for(var i=0; p=path[i]; i++) {
				require(p);
			}
		}
	}
}