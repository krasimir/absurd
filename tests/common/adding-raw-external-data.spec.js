describe("Adding raw data", function() {

	var api = require('../../index.js')();

	it("should add raw data from a file", function(done) {
		api
		.add({ body: { fontSize: '20px'}})
		.rawImport(__dirname + "/../data/styles.css")
		.add({ p: { display: 'block'}})
		.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{font-size: 20px;}body {margin-top: 10px;}h1,h2,h3 {margin: 0;padding: 0;}p{display: block;}");
			done();
		}, {minify: true});		
	});

});