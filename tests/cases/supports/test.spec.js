describe("Test case (supports)", function() {

	var Absurd = require('../../../index.js');

	it("supports / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box){.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("supports / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box){.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("supports / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box) {.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

});