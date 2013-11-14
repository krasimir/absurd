describe("Shoud prevent camel case transformation", function() {

	it("keep camel case", function(done) {
		var api = require("../../index.js")();
		api.add({
			body: {
				lineHeight: "20px"
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  lineHeight: 20px;\n}\n");
			done();
		}, { keepCamelCase: true })
	});

});