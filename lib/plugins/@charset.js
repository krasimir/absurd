module.exports = function() {	
	return function(api, charsetValue) {
		api.raw("@charset: \"" + charsetValue + "\";");
	}
}