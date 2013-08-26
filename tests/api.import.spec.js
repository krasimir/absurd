describe("API(import)", function() {

	it("should import files", function(done) {
		var Absurd = require("../index.js");
		Absurd(__dirname + '/data/css/header.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('background: #BADA55');
			expect(css).toContain('height: 97%');
			done();
		});
	});

});