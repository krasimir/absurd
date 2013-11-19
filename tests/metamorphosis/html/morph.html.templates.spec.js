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
			expect(html).toBe('<html>\n\
<head>\n\
<title>\n\
AbsurdJS preprocessor\n\
</title>\n\
</head>\n\
<body>\n\
<h1>oh yeah</h1>\n\
<a href="#" target="_blank">\n\
link\n\
</a>\n\
<footer>\n\
footer text\n\
</footer>\n\
</body>\n\
</html>');
			done();
		});
	});

});