describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use templates", function(done) {

		api.morph("html").add({
			title: "AbsurdJS preprocessor"
		}, "title");

		api.add({
			a: {
				_: "link",
				_attrs: {
					href: "#",
					target: "_blank"
				}
			}
		}, "link");

		api.add({
			footer: {
				_: "footer text"
			}
		}, "footer");

		api.add({
			html: {
				head: {
					_tpl: "title"
				},
				body: {
					_: "<h1>oh yeah</h1>",
					_tpl: ["link", "footer"]
				}
			}
		})

		api.compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>AbsurdJS preprocessor</title></head><body><h1>oh yeah</h1><a href="#" target="_blank">link</a><footer>footer text</footer></body></html>');
			done();
		}, { minify: true });
	});

});