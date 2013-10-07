describe("Test case (colon-space)", function() {

	var Absurd = require('../../../index.js');

	it("colon-space / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('a {\n  margin: auto;\n  padding: 0;\n}\n');
			done();
		});
	});

});