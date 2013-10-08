describe("Test case (keyframes)", function() {

	var Absurd = require('../../../index.js');

	it("keyframes / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {\n0% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n');
			done();
		});
	});

});