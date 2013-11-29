describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile html with data", function(done) {
		api.morph("html").add({
			body: {
				p: "Hello, my name is {{name}}!",
				small: "I'm {{profile.age}} years old",
				ul: {
					li: "I write {{skill}}."
				}
			}
		}).compile(function(err, html) {
			console.log(html);
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><p>Hello, my name is John!</p></body>');
			done();
		}, { 
			minify: true,
			data: {
				name: "John",
				profile: { age: 29 },
				skills: ['javascript', 'html', 'css']
			}
		});
	});

});