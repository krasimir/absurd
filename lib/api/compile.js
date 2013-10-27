var extend = function(destination, source) {
	for (var key in source) {
		if (hasOwnProperty.call(source, key)) {
			destination[key] = source[key];
		}
	}
	return destination;
};

module.exports = function(api) {
	return function() {
		var path = null, callback = null, options = null;
		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": callback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object": options = arguments[i]; break;
			}
		}

		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			processor: require("../processors/CSS.js")()
		};
		options = extend(_defaultOptions, options || {});

		options.processor(
			api.getRules(),
			function(err, css) {
				if(path != null) {
					try {
						fs.writeFile(path, css, function (err) {
							callback(err, css);
						});
					} catch(err) {
						callback(err);
					}
				} else {
					callback(err, css);
				}
			},
			options
		);
		
	}
}