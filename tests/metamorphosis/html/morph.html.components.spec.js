describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("complex html", function(done) {
		var inputField = function(name, defaultValue) {
			return {
				input: {
					_attrs: {
						type: "text",
						placeholder: defaultValue,
						name: name
					}
				}
			}
		}
		var submit = function(value) {
			return {
				input: {
					_attrs: {
						type: "submit",
						value: value || "submit the data"
					}
				}
			}
		}
		api.morph("html").add({
			html: {
				head: {
					title: "html page"
				},
				body: {
					form: [
						{ _: "<label>Please fill the form</label>"},
						inputField("username", "Please type your username"),
						inputField("email", "Please type your email"),
						submit
					]
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>html page</title></head><body><form><label>Please fill the form</label><input type="text" placeholder="Please type your username" name="username"></input><input type="text" placeholder="Please type your email" name="email"></input><input type="submit" value="submit the data"></input></form></body></html>');
			done();
		}, { minify: true });
	});

});