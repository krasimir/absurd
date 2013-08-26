describe("Nested selectors", function() {

	var Absurd = require("../index.js");

	it("should use nesting", function(done) {
		Absurd(__dirname + '/data/css/nested.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('.content p');
			expect(css).toContain('.content p a');
			done();
		});
	});

});