module.exports = function(value) {
	var units = require('../../helpers/units'), 
		args = require('../../helpers/args')(value),
		r = {};
	if(args.length == 2) {
		if(args[0] != '') {
			r.width = units(args[0]);
		}
		if(args[1] != '') {
			r.height = units(args[1]);
		}
		return r;
	} else {
		return {
			width: units(args[0]),
			height: units(args[0])
		}
	}
}