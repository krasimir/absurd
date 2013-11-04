describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../index.js')();

	api.morph("html");

	it("should accept and compile html", function(done) {
		api.add({
			_raw:'<!DOCTYPE html>',
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
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			console.log(html);
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>html page</title>\n\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n\
  </head>\n\
  <body>\n\
    <section>\n\
      <h1>that\'s html page</h1>\n\
    </section>\n\
  </body>\n\
</html>');
			done();
		});
	});

});