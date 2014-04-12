describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile nested tags", function(done) {
		var headTags = [
			{ title: "page title" },
			{ style: {} }
		];
		api.morph("html").add({
			html: {
				head: headTags,
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>page title</title><style></style></head><body></body></html>');
			done();
		}, { minify: true });
	});

	it("should compile list", function(done) {
		api.morph("html").add({
			html: {
				body: {
					ul: [
						{ li: 'A' },
						{ li: 'B' },
						{ li: 'C' },
						{ li: 'D' }
					]
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><body><ul><li>A</li><li>B</li><li>C</li><li>D</li></ul></body></html>');
			done();
		}, { minify: true });
	});

	it("should compile array of strings", function(done) {
		api.morph("html").add({
			html: [
				'<body>',
				'<h1>Title</h1>',
				'</body>'
			]
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><body><h1>Title</h1></body></html>');
			done();
		}, { minify: true });
	});

});