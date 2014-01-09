describe(".define function", function() {

	var api = require('../../index.js')();

	it("should use define to register a variable", function(done) {
		api.flush().define("brand-color", "#BADA55");
		api.add({
			body: {
				color: '<% brand-color %>',
				borderTop: '1px <%brand-color%> dotted'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{color: #BADA55;border-top: 1px #BADA55 dotted;}');
			done();
		}, { minify: true });
	});

	it("should use define to register a function", function(done) {
		api.flush().define("brand-color", function() {
			return '#BADA55';
		});
		api.add({
			body: {
				color: '<% brand-color %>',
				borderTop: '1px <% brand-color %> dotted'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{color: #BADA55;border-top: 1px #BADA55 dotted;}');
			done();
		}, { minify: true });
	});

});