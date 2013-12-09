describe("Componenting", function() {

	var api = require('../../../index.js')();

	it("should define component and compile it with data", function(done) {
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
						"a[href=\"http://bla.com\"]": "<% this.data.label %>"
					}
				}
			}
		};
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe('#widget{width: 200px;padding: 30px 10px;background: #aaa;}#widget a{font-size: 20px;text-decoration: none;}')
			expect(html).toBe('<div id="widget"><p><a href="http://bla.com">link label</a></p></div>')
			done();
		}, { minify: true,  data: { label: "link label"} });
	});

});