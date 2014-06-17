module.exports = function(api) {
	var navigationTheme = require(__dirname + '/navigation-theme.js');
	api.add({
		body: {
			fz: '30px',
			lh: '40px'
		}
	})
	.add(navigationTheme({ prefix: 'Nav-Top', linkColor: 'red' }))
    .add(navigationTheme({ prefix: 'Nav-Bottom', linkColor: 'blue' }));
}