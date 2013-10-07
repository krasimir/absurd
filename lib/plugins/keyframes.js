module.exports = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var content = '';
			api.raw(content);
		}
	}
}