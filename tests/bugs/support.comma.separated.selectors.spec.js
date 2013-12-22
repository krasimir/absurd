describe("Support comma separated selectors", function() {

	var api = require('../../index.js')();

	it("Support comma separated selectors", function(done) {
		api.add({
			"body, section, h1": {
				padding: "20px",
				"b, i": { fontSize: "20px"}
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body,section,h1{padding: 20px;}body b,body i,section b,section i,h1 b,h1 i{font-size: 20px;}");
			done();
		}, {minify: true});
	});

});