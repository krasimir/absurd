describe("Test case (media)", function() {

	var Absurd = require('../../../index.js');

	it("media / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header {\n  font-size: 20px;\n}\n@media print {\nheader {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

	it("media / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header {\n  font-size: 20px;\n}\n@media print {\nheader {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

	it("media / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header {\n  font-size: 20px;\n}\n@media all (max-width: 950px) {\nheader {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

});