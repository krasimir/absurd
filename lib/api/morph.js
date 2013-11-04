var metamorphosis = {
	html: function(api) {
		api.hook("add", function(tags) {
			console.log(tags);
			return true;
		});
	}
}
module.exports = function(api) {
	return function(type) {
		if(metamorphosis[type]) {
			metamorphosis[type](api);
		}
		return api;
	}
}