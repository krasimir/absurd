describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use templates", function(done) {

		api.morph("html").add({
			'.content': "AbsurdJS <% type %> preprocessor and <% language('JavaScript') %> library."
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">AbsurdJS cSS preprocessor and JAVASCRIPT library.</div>');
			done();
		}, { 
			minify: true,
			type: 'cSS',
			language: function(l) {
				return l.toUpperCase();
			}
		});
	});

});