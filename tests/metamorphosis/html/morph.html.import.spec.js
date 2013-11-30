describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')(),
	    expectedResult = '<!DOCTYPE html><head><title>AbsurdJS is awesome</title></head><body><div class="container"><p>text here</p></div></body>';

	it("should use the import method", function(done) {
		api.morph("html").import(__dirname + "/../../data/html.json").compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
            expect(html).toBe(expectedResult);
			done();
		}, { minify: true });
	});
	
	it("should use the import method", function(done) {
		api.morph("html").import(__dirname + "/../../data/html.yml").compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
            expect(html).toBe(expectedResult);
			done();
		}, { minify: true });
	});

});