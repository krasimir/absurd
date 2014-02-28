describe("Nested components", function() {

	var api = require('../../../index.js')();

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
							marginTop: "20px",
							"@media all and (max-width: 640px)": {
								marginTop: "10px"
							}
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
		api.morph("component").add(page).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe("body{margin: 10px;width: 100%;height: 100%;padding: 0px;}body section{margin-top: 20px;}h1{font-weight: normal;}p,.title{font-size: 24px;}p{line-height: 28px;}@media all and (max-width: 640px){body section{margin-top: 10px;}}");
			expect(html).toBe('<!DOCTYPE html><html><head><title>That\'s my page</title></head><body><h1 class="title">Hello world</h1><p>Text of the <b>page</b>.</p></body></html>');
			done();
		}, { minify: true })
	});

});