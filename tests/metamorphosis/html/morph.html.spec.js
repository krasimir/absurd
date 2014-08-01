describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile an empty tag", function(done) {
		api.morph("html").add({
			body: null
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body/>');
			done();
		}, { minify: true });
	});

	it("should compile tag with text inside", function(done) {
		api.morph("html").add({
			body: "page text"
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>page text</body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" }
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black"></body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes and text inside", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" },
				_: "page text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black">page text</body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes, text inside and nested tag", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" },
				_: "page text",
				p: "paragraph text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black">page text<p>paragraph text</p></body>');
			done();
		}, { minify: true });
	});

	it("should compile raw content", function(done) {
		api.morph("html").add({
			_: '<html></html>'
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html></html>');
			done();
		}, { minify: true });
	});	

	it("should compile nested tags", function(done) {
		api.morph("html").add({
			html: {
				head: {
					title: "title"
				},
				body: null
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>title</title></head><body/></html>');
			done();
		}, { minify: true });
	});

	it("should compile raw content + nested tag", function(done) {
		api.morph("html").add({
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
			expect(html).toBe('<body><p>That\'s my text<a href="#">read more</a></p></body>');
			done();
		}, { minify: true });
	});

});