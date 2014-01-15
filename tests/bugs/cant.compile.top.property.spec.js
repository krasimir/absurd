describe("Can't compile top property", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		api.add({
			'header': {
				position: 'absolute',
				top: '100px'
			}
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("header{position: absolute;top: 100px;}");
			done();
		}, {minify: true});
	})

});