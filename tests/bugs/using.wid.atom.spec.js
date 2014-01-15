describe("Using wid atom", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			header: {
				"-w-width": "100%"
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{width: 100%;-webkit-width: 100%;}');
			done();
		}, { minify: true });
	});

});