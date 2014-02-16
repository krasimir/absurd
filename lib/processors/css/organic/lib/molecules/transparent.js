module.exports = function(value) {
	var args = require('../../helpers/args')(value),
		r = {};
	value = parseFloat(value);
	r['-s-filter'] = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (value * 100) + ')';
	r['filter'] = 'alpha(opacity=' + (value * 100) + ')';
	r['-m-opacity'] = value;
	r['opacity'] = value;
	r['KhtmlOpacity'] = value;
	return r;
}