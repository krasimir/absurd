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
				'img[src="#"]': null
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
			expect(html).toBe('<html><body><header><div class="logo"><img src="#"/></div><nav><a href="#">Home</a><a href="#">Products</a><a href="#">Contacts</a></nav><div class="profile"><span class="name">John Doe</span></div></header></body></html>');
			done();
		}, { minify: true });
	});

});