module.exports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../Processor");		
		if(typeof value === "object") {			
			var content = '@keyframes ' + value.name + " {\n";
			content += processor({mainstream: value.frames});
			content += "}";
			api.raw(content);
		}
	}
}