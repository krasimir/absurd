describe("Adding raw data", function() {

	var Absurd = require('../../index.js'),
		comment = "AbsurdJS is awesome!";

	it("should send raw data", function(done) {
		Absurd(function(api) {
			api
			.add({
				body: {
					marginTop: "20px"
				}
			})
			.raw('/* ' + comment + ' */')
			.add({
				a: {
					paddingTop: "20px"
				}
			})
			.raw('/* end of styles */');
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin-top: 20px;\n}\n/* " + comment + " */\na {\n  padding-top: 20px;\n}\n/* end of styles */\n");
			done();
		});		
	});

});