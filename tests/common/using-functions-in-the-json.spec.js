describe("Using functions inside the json file", function() {

	var Absurd = require("../../index.js");

	it("should not include empty selectors", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					p: {
						fontSize: function() {
							return "10px"
						}
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body p {\n  font-size: 10px;\n}\n")
			done();
		});
	});

});