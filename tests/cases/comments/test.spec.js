describe("Test case (Comments)", function() {

	var Absurd = require('../../../index.js');

	it("Comments / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  foo: \'bar\';\n}\n');
			done();
		});
	});

});