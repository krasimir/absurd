describe("Using li:a", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			ul: {
				mar: 0,
				pad: 0,
				lis: 'n',
				li: {
					pad: 0,
					mar: 0,
					a: {

					}
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('ul,ul li{margin: 0;padding: 0;}ul{list-style: none;}');
			done();
		}, { minify: true });
	});

});