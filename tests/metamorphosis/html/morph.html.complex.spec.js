describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("complex html", function(done) {
		api.morph("html").add({
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
					_attrs: { cls: "home-page" },
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html><html><head><title>html page</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta></head><body cls="home-page"><section><h1>that\'s html page</h1></section></body></html>');
			done();
		}, { minify: true });
	});

});