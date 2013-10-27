describe("Fixing allow empty values - ", function() {

	var Absurd = require('../../index.js');

	it("should use empty value", function(done) {
		Absurd(function(api) {
			api.add({
				section: {
					":after": {
						content: ""
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("section:after {\n  content: \"\";\n}\n");
			done();
		});		
	});

});