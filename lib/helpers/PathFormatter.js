module.exports = function(path) {
	var _path = {};
	if(!path) {
		return false;
	} else if(typeof path == "string") {
		_path = {source: path};
	} else {
		_path = path;
	}
	return _path;
}