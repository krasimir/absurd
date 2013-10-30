describe("Import YAML instead of .js file", function() {

	var Absurd = require('../../index.js');

	it("importing .yaml (api usage)", function(done) {
		Absurd(function(api) {
			api.import(__dirname + "/../data/styles.yaml");
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n}\nbody p {\n  line-height: 30px;\n}\n");
			done();
		});	
	});
  
  it("importing .yml (api usage)", function(done) {
		Absurd(function(api) {
			api.import(__dirname + "/../data/styles.yml");
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n}\nbody p {\n  line-height: 30px;\n}\n");
			done();
		});	
	});

	it("importing .yaml", function(done) {
		Absurd(__dirname + "/../data/styles.yaml").compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n}\nbody p {\n  line-height: 30px;\n}\n");
			done();
		});	
	});

});
