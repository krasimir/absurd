describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should minify html", function(done) {
		api.morph("html").add({
			body: {
				header: "header",
				section: [
					{ p: "test" },
					{ p: "lorem ipsum" },
					{ img: null }
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><header>header</header><section><p>test</p><p>lorem ipsum</p><img/></section></body>');
			done();
		}, { minify: true });
	});

});