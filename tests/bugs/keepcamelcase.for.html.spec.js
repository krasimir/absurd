describe("Allow usage of keepCamelCase", function() {

	var api = require('../../index.js')();

	it("should use keepCamelCase", function(done) {
		api.morph("html").add({
			testProperty: {
				SomeElement: "text here"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe("<testProperty><SomeElement>text here</SomeElement></testProperty>");
			done();
		}, {keepCamelCase: true, minify: true});		
	});

});