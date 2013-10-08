describe("Test case (keyframes)", function() {

	var Absurd = require('../../../index.js');

	it("keyframes / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {\n0%, 10%, 20% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n@-webkit-keyframes fade {\n0%, 10%, 20% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n');
			done();
		});
	});

	it("keyframes / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {\n0% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n@-webkit-keyframes fade {\n0% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n');
			done();
		});
	});

	it("keyframes / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {\n0%,20% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n@-webkit-keyframes fade {\n0%,20% {\n  opacity: 0;\n}\n100% {\n  opacity: 1;\n}\n}\n@keyframes move {\nfrom {\n  top: 10px;\n  margin: 20px 0 0 0;\n}\nto {\n  top: 12px;\n  margin: 40px 0 0 0;\n}\n}\n@-webkit-keyframes move {\nfrom {\n  top: 10px;\n  margin: 20px 0 0 0;\n}\nto {\n  top: 12px;\n  margin: 40px 0 0 0;\n}\n}\n');
			done();
		});
	});

});