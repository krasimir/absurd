var extend = require("../helpers/Extend");

module.exports = function(api) {
	return function() {
		var path = null, callback = function() {}, options = null;
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
			keepCamelCase: false,
			processor: api.defaultProcessor,
			api: api
		};
		options = extend(_defaultOptions, options || {});

		return options.processor(
			api.getRules(),
			function(err, result) {
				if(path != null) {
					try {
						var fileContent = result;
						if('object' === typeof fileContent) {
							fileContent = JSON.stringify(fileContent);
						}
						fs.writeFile(path, fileContent, function (err) {
							callback(err, result);
						});
					} catch(err) {
						callback.apply({}, arguments);
					}
				} else {
					callback.apply({}, arguments);
				}
				api.flush();
			},
			options
		);
		
	}
}
