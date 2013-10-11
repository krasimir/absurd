describe("Fixing bug in array usage", function() {

	var Absurd = require('../../index.js');

	it("should use array", function(done) {
		Absurd(function(api) {
			api.plugin("hoverEffect", function(api, color) {
				return {
					":hover": {
						color: color
					}
				}
			})
			api.add({
				a: {
					color: "#000",
					hoverEffect: "#999"
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("a {\n  color: #000;\n}\na:hover {\n  color: #999;\n}\n");
			done();
		});		
	});

});