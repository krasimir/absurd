module.exports = function(api) {
	return function(file, compileFileCallback, options) {
		api.compile(function(err, css) {
			try {
				fs.writeFile(file, css, function (err) {
					compileFileCallback(err, css);
				});
			} catch(err) {
				compileFileCallback(err);
			}
		}, options);
	}
}