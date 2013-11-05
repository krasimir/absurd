describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("complex html", function(done) {
		api.add({
			_:'<!DOCTYPE html>',
			html: {
				head: {
					title: "html page",
					meta: {
						_attrs: {
							httpEquiv: "Content-Type",
							content: "text/html; charset=utf-8"
						}
					}
				},
				body: {
					_attrs: { class: "home-page" },
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html>\n\
<html>\n\
<head>\n\
<title>\n\
html page\n\
</title>\n\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n\
</head>\n\
<body class="home-page">\n\
<section>\n\
<h1>\n\
that\'s html page\n\
</h1>\n\
</section>\n\
</body>\n\
</html>');
			done();
		});
	});

});