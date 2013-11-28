describe("Componenting", function() {

	var api = require('../../../index.js')(),
		absurd = require('../../../index.js')();

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
			expect(css).toBe('#widget {\n\
  width: 200px;\n\
  padding: 30px 10px;\n\
  background: #aaa;\n\
}\n\
#widget a {\n\
  font-size: 20px;\n\
  text-decoration: none;\n\
}\n')
			expect(html).toBe('<div id="widget">\n\
<p>\n\
<a href="http://bla.com">\n\
share\n\
</a>\n\
</p>\n\
</div>')
			done();
		}, { skipIndentation: true });
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
			expect(css).toBe(".login-link {\n  color: red;\n}\n");
			expect(html).toBe('<a class="login-link">\nPlease login\n</a>');
			done();
		}, { skipIndentation: true })
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
			expect(css).toBe(".login-link, .logout-link {\n\
  color: red;\n\
}\n\
.login-link {\n\
  font-size: 16px;\n\
}\n\
.logout-link {\n\
  font-size: 11px;\n\
}\n");
			expect(html).toBe('<a class="login-link">\n\
Please login\n\
</a><a class="logout-link">\n\
Logout\n\
</a>');
			done();
		}, { skipIndentation: true })
	});

});