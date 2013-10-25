var extend = function(destination, source) {
	for (var key in source) {
		if (hasOwnProperty.call(source, key)) {
			destination[key] = source[key];
		}
	}
	return destination;
};



module.exports = function(api) {
	return function(callback, options) {
		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			processor: require("../processors/CSS.js")()
		};
		options = extend(_defaultOptions, options || {});
		options.processor(
			api.getRules(),
			callback || function() {},
			options
		);
	}
}