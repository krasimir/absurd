module.exports = function(api) {
	var CSSParse = require("../helpers/CSSParse");
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