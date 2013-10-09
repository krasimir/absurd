describe("Test case (supports)", function() {

	var Absurd = require('../../../index.js');

	it("supports / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header {\n  font-size: 20px;\n}\n@supports (display: flex) or (display: box) {\n.header {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

	it("supports / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header {\n  font-size: 20px;\n}\n@supports (display: flex) or (display: box) {\n.header {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

	it("supports / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header {\n  font-size: 20px;\n}\n@supports (display: flex) or (display: box) {\n.header {\n  font-size: 30px;\n}\n}\n');
			done();
		});
	});

});