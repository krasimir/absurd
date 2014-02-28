describe("Test case (media)", function() {

	var Absurd = require('../../../index.js');

	it("media / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media print{header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("media / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media print{header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("media / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media all (max-width: 950px) {header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

});