describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../index.js')();

	api.morph("html");

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

	it("should compile an empty tag with attributes", function(done) {
		api.add({
			body: {
				_attrs: {
					class: "black",
					onload: "javascript: alert('hello');"
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black" onload="javascript: alert(\'hello\');"/>');
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
			expect(html).toBe('<html>\n<head>\n<title>title</title>\n</head>\n<body/>\n</html>');
			done();
		});
	});

	xit("should use function", function(done) {
		var getTitleTag = function(value) {
			return { title: value }
		}
		var getMetaTag = function(value) {
			return { 
				meta: {
					_attrs: {
						httpEquiv: "Content-Type",
						content: "text/html; charset=utf-8"
					}
				} 
			}
		}
		api.add({
			html: {
				head: [getTitleTag, getMetaTag],
				body: {}
			}
		}).compile(function(err, html) {
			console.log(html);
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>title</title>\n</head>\n<body/>\n</html>');
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

	it("complex html", function(done) {
		api.add({
			_:'<!DOCTYPE html>',
			html: {
				head: {
					title: "html page",
					meta: {
						_attrs: {
							httpEquiv: "Content-Type",
							content: "text/html; charset=utf-8"
						}
					}
				},
				body: {
					_attrs: { class: "home-page" },
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html>\n\
<html>\n\
<head>\n\
<title>html page</title>\n\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n\
</head>\n\
<body class="home-page">\n\
<section>\n\
<h1>that\'s html page</h1>\n\
</section>\n\
</body>\n\
</html>');
			done();
		});
	});

});