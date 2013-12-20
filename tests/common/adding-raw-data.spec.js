describe("Adding raw data", function() {

	var api = require('../../index.js')()

	it("should send raw data", function(done) {		
		api
		.add({
			body: {
				marginTop: "20px"
			}
		})
		.raw('body { fontSize: 20px; }')
		.add({
			a: {
				paddingTop: "20px"
			}
		})
		.raw('article:after { display: block; }')
		.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{margin-top: 20px;}body{fontSize: 20px;}a{padding-top: 20px;}article:after{display: block;}");
			done();
		}, {minify: true});		
	});
	
});