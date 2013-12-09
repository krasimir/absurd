describe("Componenting", function() {

	var api = require('../../../index.js')();

	it("should define component and compile it", function(done) {
		var component = {
			css: {
				"#widget": {
					width: "200px",
					padding: "30px 10px",
					background: "#aaa",
					a: {
						fontSize: "20px",
						textDecoration: "none"
					}
				}
			},
			html: {
				"div[id=\"widget\"]": {
					p: {
						"a[href=\"http://bla.com\"]": "share"
					}
				}
			}
		};
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe('#widget{width: 200px;padding: 30px 10px;background: #aaa;}#widget a{font-size: 20px;text-decoration: none;}')
			expect(html).toBe('<div id="widget"><p><a href="http://bla.com">share</a></p></div>')
			done();
		}, { minify: true });
	});

	it("should use a function instead of object", function(done) {
		var component = function() {
			return {
				css: {
					".login-link": { color: "red"}
				},
				html: {
					'a.login-link': "Please login"
				}
			}
		}
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe(".login-link{color: red;}");
			expect(html).toBe('<a class="login-link">Please login</a>');
			done();
		}, { minify: true })
	});

	it("should compile several components", function(done) {
		var componentA = function() {
			return {
				css: {
					".login-link": { color: "red", fontSize: "16px" }
				},
				html: {
					'a.login-link': "Please login"
				}
			}
		}
		var componentB = function() {
			return {
				css: {
					".logout-link": { color: "red", fontSize: "11px" }
				},
				html: {
					'a.logout-link': "Logout"
				}
			}
		}
		api.morph("component").add([componentA, componentB]).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe(".login-link,.logout-link{color: red;}.login-link{font-size: 16px;}.logout-link{font-size: 11px;}");
			expect(html).toBe('<a class="login-link">Please login</a><a class="logout-link">Logout</a>');
			done();
		}, { minify: true })
	});

});