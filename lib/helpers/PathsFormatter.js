module.exports = function(paths) {
	var _paths = [];
	if(!paths) {
		return _paths;
	} else if(typeof paths == "string") {
		_paths.push({path: paths});
	} else if(typeof paths.length != undefined && paths.length > 0) {
		for(var i=0; i<paths.length; i++) {
			if(typeof paths[i] == "string") {
				_paths.push({path: paths[i]});
			} else if(typeof paths[i] == "object") {
				_paths.push(paths[i]);
			}
		}
	} else {
		_paths.push(paths);
	}
	return _paths;
}