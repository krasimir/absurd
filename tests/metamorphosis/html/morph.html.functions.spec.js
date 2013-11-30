describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use function", function(done) {
		var getTitleTag = function(value) {
			return {
				title: value
			}
		}
		var bodyContent = function() {
			return {
				p: "text"
			}
		}
		api.morph("html").add({
			html: {
				head: getTitleTag("Absurd is awesome"),
				body: bodyContent
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>Absurd is awesome</title></head><body><p>text</p></body></html>');
			done();
		}, { minify: true });
	});

});