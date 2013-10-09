describe("Test case (page)", function() {

	var Absurd = require('../../../index.js');

	it("page / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

	it("page / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

	it("page / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

});