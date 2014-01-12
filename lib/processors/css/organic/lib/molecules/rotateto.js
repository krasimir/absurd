module.exports = function(value) {
	var units = require('../../helpers/units'), 
		args = require('../../helpers/args')(value);
	if(args.length == 1) {
		return {"-ws-trf": ">rotate(" + units(args[0], 'deg') + ")"};
	}	
}