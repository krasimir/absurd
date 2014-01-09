module.exports = function(value) {
	var r = {},
		args = require('../../helpers/args')(value);
	if(args.length == 2) {
		if(args[0] != '') {
			r.margin = args[0];
		}
		if(args[1] != '') {
			r.padding = args[1];
		}
		return r;
	} else {
		return {
			margin: args[0],
			padding: args[1] || args[0]
		}
	}
}