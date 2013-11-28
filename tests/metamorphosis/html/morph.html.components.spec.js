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
			expect(html).toBe('<html>\n\
<head>\n\
<title>\n\
html page\n\
</title>\n\
</head>\n\
<body>\n\
<form>\n\
<label>Please fill the form</label>\n\
<input type="text" placeholder="Please type your username" name="username"/>\n\
<input type="text" placeholder="Please type your email" name="email"/>\n\
<input type="submit" value="submit the data"/>\n\
</form>\n\
</body>\n\
</html>');
			done();
		}, { skipIndentation: true });
	});

});