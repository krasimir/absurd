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
			expect(css).toBe("body{background: blue;}html{background: pink;}body,html{color: red;}");
			done();
		}, { minify: true });
	});

});