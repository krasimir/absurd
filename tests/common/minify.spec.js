describe("Minification", function() {

	var Absurd = require('../../index.js');

	it("should send raw data", function(done) {
		Absurd(function(api) {
			api
			.add({
				body: {
					marginTop: "20px",
					p: {
						fontSize: "5px"
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{margin-top: 20px;}body p{font-size: 5px;}");
			done();
		}, {minify: true});		
	});

});