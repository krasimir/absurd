describe("Test case (keyframes)", function() {

	var Absurd = require('../../../index.js');

	it("keyframes / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			console.log(css);
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('');
			done();
		});
	});

});