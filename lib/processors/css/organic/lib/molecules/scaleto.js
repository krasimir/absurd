module.exports = function(value) {
	var args = require('../../helpers/args')(value),
		x = !args[0] || args[0] == '' ? 0 : args[0],
		y = !args[1] || args[1] == '' ? 0 : args[1];
	if(args.length == 2) {
		return {"-ws-trf": ">scale(" + x + "," + y + ")"};
	}
}