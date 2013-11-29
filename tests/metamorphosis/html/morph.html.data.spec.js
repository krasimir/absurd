describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile html with data", function(done) {
		api.morph("html").add({
			body: {
				p: "Hello, my name is {{this.data.name}}!",
				small: "I'm \"{{this.data.profile.age}}\" {years} old",
				ul: {
					li: "a"
				}
			}
		}).compile(function(err, html) {
			console.log("\n\n", html);
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><p>Hello, my name is John!</p></body>');
			done();
		}, {
			data: {
				name: "John",
				profile: { age: 29 },
				skills: ['javascript', 'html', 'css']
			}
		});
	});

});