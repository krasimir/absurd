var registry = require('npm-stats')(),
	JSONStream = require('JSONStream'),
	module = 'absurd';

var showDownloads = function(callback) {
	registry.module(module).downloads(function(err, data) {
		var str = '===================== Downloads\n',
			total = 0,
			month = 0,
			currentMonth = '';
		if(typeof data != 'undefined') {
			for(var i=0; i<data.length; i++) {
				var d = data[i].date.split('-');
				if(currentMonth != d[1]) {
					if(currentMonth != '') {
						str += 'Month (' + currentMonth + '): ' + month + '\n';
					}
					month = data[i].value;
					currentMonth = d[1];
				} else {
					month += data[i].value;
				}
				if(i > data.length-8) {
					str += ' ' + data[i].date + ': ' + data[i].value + '\n';	
				}
				if(i == data.length-1) {
					str += 'Month (' + currentMonth + '): ' + month + '\n';
				}
				total += data[i].value;
			}
			console.log(str + '---------\nTotal: ' + total + '\n');
			callback();
		}
	});
}

var showVersion = function(callback) {
	console.log('===================== version');
	stream = registry.module(module).field('version', function(err, data) {
		console.log(data.absurd.version + "\n");
	});
}

showDownloads(function() {
	showVersion(function() {

	});
})