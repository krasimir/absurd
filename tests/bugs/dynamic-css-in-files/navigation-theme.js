module.exports = function(data) {
	var obj = {};
	obj['.' + data.prefix + '-_Link'] = {
		color: data.linkColor
	}
	return obj;
}