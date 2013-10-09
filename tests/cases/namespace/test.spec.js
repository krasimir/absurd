describe("Test case (media)", function() {

	var Absurd = require('../../../index.js');

	it("media / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

	it("media / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

	it("media / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

});