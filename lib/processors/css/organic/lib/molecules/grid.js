module.exports = function(value) {
	var args = require('../../helpers/args')(value);
	if(args.length == 2) {
		var res = {
			cf: 'both'
		}	
		res[args[1]] = {
			fl: 'l',
			'-mw-bxz': 'bb',
			wid: (100 / parseInt(args[0])).toFixed(2) + '%'
		}
		return res;
	} else {
		return {};
	}
}