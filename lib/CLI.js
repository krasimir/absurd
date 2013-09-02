var colors = require('colors'),
	glob = require("glob"),
	fs = require("fs"),
	pathToWatch = '',
	pathFiles = [],
	watcher,
	absurd,
	argv;

var compile = function(absurd, source, output) {
	// if there is output provided
	if(output) {
	    absurd(process.cwd() + "/" + source).compileFile(output, function(err, css) {
	    	if(err) throw err;
	    	console.log(("> save: " + output).green);
	    });
	} else {
		absurd(process.cwd() + "/" + source).compile(function(err, css) {
			if(err) throw err;
	    	console.log(("> css: " + css).green);
	    });
	}
}

var checkForNewFiles = function() {
	glob(pathToWatch, {}, function (err, files) {
		if(err) {
			console.log(("> glob error").red, err);
		} else {
			// comparing
			if(pathFiles && pathFiles.length > 0) {
				for(var i=0; i<files.length; i++) {
					var fNew = files[i];
					var isItThere = false;
					for(var j=0; j<pathFiles.length; j++) {
						var fOld = pathFiles[j];
						if(fNew == fOld) {
							isItThere = true;
						}
					}
					if(!isItThere) {
						watcher.add([fNew], function(){});
						eventFired("added", fNew);
					}
				}
			}
			pathFiles = files;
		}
		setTimeout(checkForNewFiles, 500);
	});
}

var eventFired = function(event, filepath) {
	fs.stat(filepath, function(err, stats) {
		if(stats && stats.isFile()) {
			console.log(("> " + event + ": " + filepath).yellow);
			compile(absurd, argv.s, argv.o);
		}
	});
}

module.exports = function(ar, ab) {
	argv = ar;
	absurd = ab;
	// if there is source provided	
	if(argv.s) {
		compile(absurd, argv.s, argv.o);
		// if there is watcher provided
		if(argv.w) {
			
			pathToWatch = process.cwd() + "/" + argv.w + "/**/*.js";
			
			var startWatcher = function() {
				var Gaze = require('gaze').Gaze;
				new Gaze([pathToWatch], {}, function(err) {
					if(err) console.log(('> ' + err).read);
					watcher = this;
					watcher.on('all', function(event, filepath) {
						eventFired(event, filepath);
					});
				})
			}

			console.log(("> watching: \n> " + pathToWatch).magenta);
			startWatcher();
			checkForNewFiles();

		}
	}

}