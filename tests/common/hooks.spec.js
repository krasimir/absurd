describe("Hooks", function() {

	var Absurd = require('../../index.js');

	it("Adding hook (add method)", function(done) {
		Absurd(function(api) {
			api.hook("add", function(rules, stylesheet) {
				expect(rules).toBeDefined();
				expect(stylesheet).not.toBeDefined();
				expect(rules.body).toBeDefined();
				expect(rules.body.fontSize).toBeDefined();
				expect(rules.body.fontSize).toBe("20px");
			}).add({
				body: {
					fontSize: "20px"
				}
			}).compile(function(err, css) {
				expect(css).toBe("body {\n  font-size: 20px;\n}\n");
				done();
			})
		});
	});

	it("Prevent default", function(done) {
		Absurd(function(api) {
			api.hook("add", function(rules, stylesheet) {
				return true;
			}).add({
				body: {
					fontSize: "20px"
				}
			}).compile(function(err, css) {
				expect(css).toBe("");
				done();
			})
		});
	});

	it("Adding hook (import method)", function(done) {
		Absurd(function(api) {
			api.hook("import", function(file) {
				if(file === "body-styles.bla") {
					api.add({
						body: {
							fontSize: "11.5px"
						}
					});
				}
			}).add({
				body: {
					fontSize: "20px"
				}
			})['import']("body-styles.bla").compile(function(err, css) {
				expect(css).toBe("body {\n  font-size: 11.5px;\n}\n");
				done();
			})
		});
	});

	it("Adding hook (compile method)", function(done) {
		Absurd(function(api) {
			api.hook("compile", function(callback, options) {
				callback(null, "AbsurdJS is awesome!")
				return true;
			}).add({
				body: {
					fontSize: "20px"
				}
			})['import']("body-styles.bla").compile(function(err, css) {
				expect(css).toBe("AbsurdJS is awesome!");
				done();
			})
		});
	});

});