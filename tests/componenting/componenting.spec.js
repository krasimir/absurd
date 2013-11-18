describe("Componenting", function() {

	var api = require('../../index.js')();

	xit("should access components storage", function(done) {
		expect(api.getComponents()).toBeDefined();
		expect(typeof api.getComponents()).toBe("object");
		done();
	});

	xit("should define component", function() {
		var component = api.component("widget", {
			css: {
				width: "200px",
				padding: "30px 10px",
				background: "#aaa",
				a: {
					fontSize: "20px",
					textDecoration: "none"
				}
			},
			html: {

			}
		});
	});

});