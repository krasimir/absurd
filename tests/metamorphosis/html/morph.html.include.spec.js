describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use _include", function(done) {
		var profile = function() {
			return {
				".profile": {
					"span.name": "John Doe"
				}
			}
		}
		var logo = {
			".logo": {
				'img[src="#"]': {}
			}
		}
		var nav = {
			nav: [
				{ 'a[href="#"]': "Home" },
				{ 'a[href="#"]': "Products" },
				{ 'a[href="#"]': "Contacts" }
			]
		}
		var header = {
			header: {
				_include: [logo, nav, profile]
			}
		}
		var page = {
			html: {
				body: {
					_include: header
				}
			}
		}
		api.morph("html").add(page).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n\
<body>\n\
<header>\n\
<div class="logo">\n\
<img src="#"/>\n\
</div><nav>\n\
<a href="#">\n\
Home\n\
</a>\n\
<a href="#">\n\
Products\n\
</a>\n\
<a href="#">\n\
Contacts\n\
</a>\n\
</nav><div class="profile">\n\
<span class="name">\n\
John Doe\n\
</span>\n\
</div>\n\
</header>\n\
</body>\n\
</html>');
			done();
		}, { skipIndentation: true });
	});

});