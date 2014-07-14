describe("API(import)", function() {

	it("should import files", function(done) {
		var Absurd = require("../../index.js");
		Absurd(__dirname + '/../data/css/header.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body{background: #BADA55;width: 100%;height: 97%;}.header{margin: 10px 0 20px 10px;}footer.a{background: #111;}header.a{background: #222;}');
			done();
		}, { minify: true });
	});

});