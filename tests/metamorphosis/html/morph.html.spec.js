describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should compile an empty tag", function(done) {
		api.add({
			body: {}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body/>');
			done();
		});
	});

	it("should compile tag with text inside", function(done) {
		api.add({
			body: "page text"
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>\npage text\n</body>');
			done();
		});
	});

	it("should compile tag with attributes", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" }
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black"/>');
			done();
		});
	});

	it("should compile tag with attributes and text inside", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" },
				_: "page text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black">\npage text\n</body>');
			done();
		});
	});

	it("should compile tag with attributes, text inside and nested tag", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" },
				_: "page text",
				p: "paragraph text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black">\npage text\n<p>\nparagraph text\n</p>\n</body>');
			done();
		});
	});

	it("should compile raw content", function(done) {
		api.add({
			_: '<html></html>'
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html></html>');
			done();
		});
	});	

	it("should compile nested tags", function(done) {
		api.add({
			html: {
				head: {
					title: "title"
				},
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>\ntitle\n</title>\n</head>\n<body/>\n</html>');
			done();
		});
	});

	it("should compile raw content + nested tag", function(done) {
		api.add({
			body: {
				p: {
					_: "That's my text",
					a: {
						_: "read more",
						_attrs: { href: "#"}
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>\n\
<p>\n\
That\'s my text\n\
<a href="#">\n\
read more\n\
</a>\n\
</p>\n\
</body>');
			done();
		});
	});

});