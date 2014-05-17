describe("Should use dynamic expressions in css", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.morph('dynamic-css').add({
		    '.content <% elClass %>': {
		    	width: '<% w %>',
		    	padding: '20px'
		    }
		}).compile(function(err, css) {
			expect(css).toBe('.content .black{width: 300px;padding: 20px;}');
			done();
		}, { minify: true, w: '300px', elClass: '.black' });
	});

});