describe("Nested components", function() {

	var api = require('../../index.js')();

	it("should use a nested components", function(done) {
		var head = function() {
			return {
				css: {
					body: {
						width: "100%",
						height: "100%",
						margin: "10px",
						padding: "0px"
					}
				},
				html: {
					head: {
						title: "That's my page"
					}
				}
			};
		}
		var title = {
			css: {
				".title": {
					fontSize: "24px"
				}
			},
			html: {
				"h1.title": "Hello world"
			}
		}
		var body = function() {
			return {
				css: {
					h1: { fontWeight: "normal" },
					p: { fontSize: "24px", lineHeight: "28px" }
				},
				html: {
					body: {
						_include: title,
						p: "Text of the <b>page</b>."
					}
				}
			}
		}
		var page = function() {
			return {
				css: {
					body: {
						margin: "0px",
						section: {
							marginTop: "20px"
						}
					}
				},
				html: {
					_: "<!DOCTYPE html>",
					html: {
						_include: [head, body]
					}
				}
			}
		}
		api.compileComponent(page, function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe("body {\n\
  margin: 10px;\n\
  width: 100%;\n\
  height: 100%;\n\
  padding: 0px;\n\
}\n\
body section {\n\
  margin-top: 20px;\n\
}\n\
h1 {\n\
  font-weight: normal;\n\
}\n\
p, .title {\n\
  font-size: 24px;\n\
}\n\
p {\n\
  line-height: 28px;\n\
}\n");
			expect(html).toBe('<!DOCTYPE html>\n\
<html>\n\
<head>\n\
<title>\n\
That\'s my page\n\
</title>\n\
</head><body>\n\
<h1 class="title">\n\
Hello world\n\
</h1>\n\
<p>\n\
Text of the <b>page</b>.\n\
</p>\n\
</body>\n\
</html>');
			done();
		})
	});

});