describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should indent properly", function(done) {
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
			expect(html).toBe('<body>\n\
    <header>header</header>\n\
    <section>\n\
        <p>test</p>\n\
        <p>lorem ipsum</p>\n\
        <img/>\n\
    </section>\n\
</body>');
			done();
		});
	});

});