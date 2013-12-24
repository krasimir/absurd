var api = require("../../index.js")();
module.exports = function() {
	api.morph("html").add({
		body: {
			section: {
				'p[class="test" id="test"]': [
					{ span: 'Text 1'},
					{ span: 'Text 2'},
					{ span: 'Text 3'},
					{ span: 'Text 4'}
				]
			}
		}
	}).add({
		footer: {
			p: 'Footer content'
		}
	}).compile(function(err, html) {
		
	});
}