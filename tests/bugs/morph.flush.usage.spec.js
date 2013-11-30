describe("Morph, flush usage /", function() {

	var api = require('../../index.js')();

	it("should compile to css", function(done) {
		api.add({
			body: { margin: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 20px;\n}\n");
			done();
		});		
	});

	it("should compile to html", function(done) {
		api.morph("html").add({
			body: { p: "text" }
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe("<body><p>text</p></body>");
			done();
		}, { minify: true });		
	});

	it("should compile to css again", function(done) {
		api.add({
			body: { padding: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  padding: 20px;\n}\n");
			done();
		});		
	});

});