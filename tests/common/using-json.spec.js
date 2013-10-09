describe("Import JSON instead of .js file", function() {

	var Absurd = require('../../index.js');

	it("importing json (api usage)", function(done) {
		Absurd(function(api) {
			api.import(__dirname + "/../data/styles.json");
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n}\nbody p {\n  line-height: 30px;\n}\n");
			done();
		});	
	});

	it("importing json", function(done) {
		Absurd(__dirname + "/../data/styles.json").compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n}\nbody p {\n  line-height: 30px;\n}\n");
			done();
		});	
	});

});