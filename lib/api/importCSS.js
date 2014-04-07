var CSSParse = require("css-parse");

module.exports = function(api) {
	return function(cssData) {
		try {
			var parsed = CSSParse(cssData);
			api.handlecss(parsed, '');
		} catch(err) {
			console.log("Error in the CSS:  '" + cssData + "'", err, err.stack);
		}
		return api;
	}
}