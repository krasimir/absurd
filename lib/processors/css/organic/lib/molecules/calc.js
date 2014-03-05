module.exports = function(value) {
	var args = require('../../helpers/args')(value), r = {};
	r['LhProperty'] = '0';
	r['~~1~~' + args[0]] = '-webkit-calc(' + args[1] + ')';
	r['~~2~~' + args[0]] = '-moz-calc(' + args[1] + ')';
	r['~~3~~' + args[0]] = 'calc(' + args[1] + ')';
	return r;	
}