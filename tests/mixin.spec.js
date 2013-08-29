describe("Storage mixins", function() {

	var Absurd = require("../index.js");

	it("should use a mixin", function(done) {
		var absurd = Absurd();
		absurd
		.api
		.storage("brand-color", function(color) {
			return {
				
			}
		})
		.add({
			body: {
				color: absurd.api.storage("brand-color")
			}
		});
		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('color: #BADA55');
			done();
		});
	});

});