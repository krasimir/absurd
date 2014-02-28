describe("Test case (charset)", function() {

	var Absurd = require('../../../index.js');

	it("charset / js", function(done) {
		Absurd(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@charset: "UTF-8";body{width: 100%;}');
			done();
		}, { minify: true });
	});

	it("charset / json", function(done) {
		Absurd(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@charset: "UTF-8";\nbody {\n  width: 100%;\n}\np {\n  margin-top: 20px;\n}\n');
			done();
		});
	});

	it("charset / css", function(done) {
		Absurd(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  width: 100%;\n}\np {\n  margin-top: 20px;\n}\n@charset: "UTF-8";\na {\n  font-size: 10px;\n}\n');
			done();
		});
	});

	it("charset / inline", function(done) {
		Absurd(function(A) {
			A.add({
				body: {
					borderRadius: "2px",
					a: {
						fontSize: "2em",
						charset: "UTF-8"
					}
				},
				p: {
					margin: "2px",
					charset: "BLA-BLA"
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@charset: "UTF-8";\n@charset: "BLA-BLA";\nbody {\n  border-radius: 2px;\n}\nbody a {\n  font-size: 2em;\n}\np {\n  margin: 2px;\n}\n');
			done();
		});
	});

});