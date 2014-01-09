module.exports = function(value) {
	var units = require('../../helpers/units'), 
		args = require('../../helpers/args')(value)
		atoms = require('../atoms/atoms.js'),
		x = !args[0] || args[0] == '' ? 0 : args[0],
		y = !args[1] || args[1] == '' ? 0 : args[1],
		z = !args[2] || args[2] == '' ? 0 : args[2];
	if(args.length == 2) {
		return atoms("-ws-trf: translate(" + x + "," + y + ")");
	} else if(args.length == 3) {
		return atoms("-ws-trf: translate3d(" + x + "," + y + "," + z + ")");
	}	
}