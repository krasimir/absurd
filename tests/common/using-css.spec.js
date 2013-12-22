describe("Import CSS", function() {

	var Absurd = require('../../index.js');

	it("importing css (api usage)", function(done) {
		Absurd(function(api) {
			api.import(__dirname + "/../data/styles.css");
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin-top: 10px;\n}\nh1, h2, h3 {\n  margin: 0;\n  padding: 0;\n}\n");
			done();
		});	
	});

	it("importing css", function(done) {
		Absurd(__dirname + "/../data/styles.css").compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin-top: 10px;\n}\nh1, h2, h3 {\n  margin: 0;\n  padding: 0;\n}\n");
			done();
		});	
	});

	it("importing css and using plugins", function(done) {
		Absurd(function(api) {
			api.plugin("size", function(api, type) {
				switch(type) {
					case "large": return { fontSize: "30px" }; break;
					case "medium": return { fontSize: "24px" }; break;
					case "small": return { fontSize: "12px" }; break;
					default: return { fontSize: "16px" };
				}
			})
			api.import(__dirname + "/../data/styles.plugin.css");
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  font-size: 12px;\n  margin-top: 10px;\n}\nh1, h2, h3 {\n  margin: 0;\n  padding: 0;\n}\n");
			done();
		});	
	});

	it("handling css imports", function(done) {
		Absurd(__dirname + "/../data/main.css").compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  width: 100%;\n  margin-top: 10px;\n}\nh1, h2, h3 {\n  margin: 0;\n  padding: 0;\n}\n");
			done();
		});	
	});

});