describe("Test case (import)", function() {

	var Absurd = require('../../../index.js');

	it("import / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  margin-top: 40px;\n  font-size: 20px;\n}\np {\n  line-height: 40px;\n}\n');
			done();
		});
	});

});