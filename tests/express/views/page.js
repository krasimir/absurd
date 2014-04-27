module.exports = function(api) {
	api.add({
		h1: '<% data.title %>',
		p: 'Welcome to <% data.title %>'
	});
};