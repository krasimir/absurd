describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')(),
	    expectedResult = '<!DOCTYPE html>\n\
<head>\n\
<title>\n\
AbsurdJS is awesome\n\
</title>\n\
</head>\n\
<body>\n\
<div class="container">\n\
<p>\n\
text here\n\
</p>\n\
</div>\n\
</body>';

	api.morph("html");

	it("should use the import method", function(done) {
		api.import(__dirname + "/../../data/html.json").compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
            expect(html).toBe(expectedResult);
			done();
		});
	});
	
	it("should use the import method", function(done) {
		api.import(__dirname + "/../../data/html.yml").compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
            expect(html).toBe(expectedResult);
			done();
		});
	});

});