var colors = require('colors');

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

module.exports = function(argv, absurd) {
	// if there is source provided	
	if(argv.s) {
		compile(absurd, argv.s, argv.o);
		// if there is watcher provided
		if(argv.w) {
			// var watchr = require('watchr');
			// var paths = argv.w.split(",");
			// watchr.watch({
			//     paths: paths,
			//     listeners: {
			//         log: function(logLevel){
			//             // console.log('a log message occured:', arguments);
			//         },
			//         error: function(err){
			//             console.log('> an error occured:'.red, err);
			//         },
			//         watching: function(err, watcherInstance, isWatching){
			//             if (err) {
			//                 console.log(("> watching the path " + watcherInstance.path + " failed with error").red, err);
			//             } else {
			//                 // console.log("watching the path " + watcherInstance.path + " completed");
			//             }
			//         },
			//         change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
			//             console.log(("> " + arguments[0] + ": " + arguments[1]).yellow);
			//             compile(absurd, argv.s, argv.o);
			//         }
			//     },
			//     next: function(err, watchers) {
			//         if (err) {
			//             return console.log("watching everything failed with error", err);
			//         } else {
			//             for(var i=0; w=watchers[i]; i++) {
			//             	console.log(("> watching " + w.config.path).magenta);
			//             }
			//         }
			//         // Close watchers after 60 seconds
			//         // setTimeout(function(){
			//         //     var i;
			//         //     console.log('Stop watching our paths');
			//         //     for ( i=0;  i<watchers.length; i++ ) {
			//         //         watchers[i].close();
			//         //     }
			//         // },60*1000);
			//     }
			// });

			var watch = require('watch')
			watch.createMonitor(argv.w, {
				ignoreDotFiles: true
			}, function (monitor) {
				monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
				monitor.on("created", function (f, stat) {
					console.log(("> new file created: " + f).yellow);
					compile(absurd, argv.s, argv.o);
				});
				monitor.on("changed", function (f, curr, prev) {
					console.log(("> file changed: " + f).yellow);
					compile(absurd, argv.s, argv.o);
				});
				monitor.on("removed", function (f, stat) {
					console.log(("> file deleted: " + f).yellow);
					compile(absurd, argv.s, argv.o);
				});
			})

			console.log(("> watching " + argv.w).magenta);

		}
	}

}