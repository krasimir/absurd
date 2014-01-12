module.exports = function(value) {
	var units = require('../../helpers/units'), 
		args = require('../../helpers/args')(value),
		x = units(!args[0] || args[0] == '' ? 0 : args[0], 'px'),
		y = units(!args[1] || args[1] == '' ? 0 : args[1], 'px'),
		z = units(!args[2] || args[2] == '' ? 0 : args[2], 'px');		
	if(args.length == 2) {
		return {"-ws-trf": ">translate(" + x + "," + y + ")"};
	} else if(args.length == 3) {
		return {"-ws-trf": ">translate3d(" + x + "," + y + "," + z + ")"};
	}	
}