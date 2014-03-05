var getMSColor = function(color) {
	color = color.toString().replace('#', '');
	if(color.length == 3) {
		var tmp = '';
		for(var i=0; i<color.length; i++) {
			tmp += color[i] + color[i];
		}
		color = tmp;
	}
	return '#FF' + color.toUpperCase();
}
module.exports = function(value) {
	var r = {},
		args = require('../../helpers/args')(value);
	switch(typeof value) {
		case 'string':
			var deg = args[args.length-1];
			if(deg.indexOf('deg') > 0) {
				deg = parseInt(args.pop().replace('deg', ''));
			} else {
				deg = 0;
			}
			var numOfStops = args.length,
				stepsPercents = Math.floor(100 / (numOfStops-1)).toFixed(2),
				gradientValue = [],
				msGradientType = (deg >= 45 && deg <= 135) || (deg >= 225 && deg <= 315) ? 1 : 0,
				msStartColor = msGradientType === 0 ? getMSColor(args[args.length-1]) : getMSColor(args[0]),
				msEndColor = msGradientType === 0 ? getMSColor(args[0]) : getMSColor(args[args.length-1]);

			for(var i=0; i<numOfStops; i++) {
				if(args[i].indexOf('%') > 0) {
					gradientValue.push(args[i]);
				} else {
					gradientValue.push(args[i] + ' ' + (i*stepsPercents) + '%');
				}
			}
			gradientValue = deg + 'deg, ' + gradientValue.join(', ');
			
			return [
				{ 'background': '-webkit-linear-gradient(' + gradientValue + ')' },
				{ '~~1~~background': '-moz-linear-gradient(' + gradientValue + ')' },
				{ '~~2~~background': '-ms-linear-gradient(' + gradientValue + ')' },
				{ '~~3~~background': '-o-linear-gradient(' + gradientValue + ')' },
				{ '~~4~~background': 'linear-gradient(' + gradientValue + ')' },
				{ 'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'' + msStartColor + '\', endColorstr=\'' + msEndColor + '\',GradientType=' + msGradientType + ')' },
				{ 'MsFilter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'' + msStartColor + '\',endColorstr=\'' + msEndColor + '\',GradientType=' + msGradientType + ')' }
			]

		break;
	}
	return {};
}