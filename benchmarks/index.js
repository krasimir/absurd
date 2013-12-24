var fs = require('fs');

var iterations = 4000, count = 0;
if(fs.existsSync(__dirname + "/scripts")) {
	var methods = fs.readdirSync(__dirname + "/scripts");
	for(var i=0; i<methods.length; i++) {
		var file = methods[i], results = [], result = 0;
		var s = require(__dirname + "/scripts/" + file);
		console.log("-----------------", file);
		while(count++ < iterations) {
			var startTime = new Date().getTime();
			s();
			results.push(new Date().getTime() - startTime);
		}
		for(var j=0; j<iterations; j++) {
			result += results[j];
		}
		console.log("Result: ", result / iterations, " (iterations: " + iterations + ")");
		count = 0;
	}
}