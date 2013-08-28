module.exports = function(argv, absurd) {	
	if(argv.s) {
		if(argv.o) {
		    absurd(process.cwd() + "/" + argv.s).compileFile(argv.o, function(err, css) {
		    	if(err) throw err;
		    	console.log(argv.o + " created successful.");
		    });
		} else {
			absurd(process.cwd() + "/" + argv.s).compile(function(err, css) {
				if(err) throw err;
		    	console.log(css);
		    });
		}
	}
}