describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should use function", function(done) {
		var getTitleTag = function(value) {
			return {
				title: value,
				meta: {
					_attrs: {
						name: "keywords",
						content: value
					}
				} 
			}
		}
		var getCharset = function() {
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
				head: [getTitleTag("Absurd is awesome"), getCharset],
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

});