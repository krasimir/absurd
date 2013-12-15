describe("Should compile properly whihe multiple classes selector is used", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.import(__dirname + "/../data/bugs/css.import.multiple.classes.css");
		api.add({
			'header': {
				width: '100px',
				height: '100px'
			}
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("header,footer,aside{display: block;}header{width: 100px;height: 100px;}");
			done();
		}, {minify: true});
	});

});