describe("Multiple selectors per rule overwrite all individual selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			'html, body': { color:'red' },
		    'body': { background:'blue' },
		    'html': { background:'pink' }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("html,body{color: red;}html{background: pink;}body{background: blue;}");
			done();
		}, { minify: true });
	});

});