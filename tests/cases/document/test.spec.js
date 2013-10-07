describe("Test case (Document)", function() {

	var Absurd = require('../../../index.js');

	it("Document / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix() {\n.ui-select .ui-btn select {\n  opacity: .0001;\n}\n}\n');
			done();
		});
	});

	it("Document / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix() {\n.ui-select .ui-btn select {\n  opacity: .0001;\n}\n}\n');
			done();
		});
	});

	it("Document / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix() {\n.ui-select .ui-btn select {\n  opacity: .0001;\n}\n}\n');
			done();
		});
	});

});