describe("Use import in external css file", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.import(__dirname + '/../data/bugs/source.css').compile(function(err, css) {
			expect(css).toBe('.class-a{font-size: 21px;}.class-b{font-size: 22px;}.class-c{font-size: 23px;}.main{margin: 120px;}');
			done();
		}, { minify: true });
	});

});