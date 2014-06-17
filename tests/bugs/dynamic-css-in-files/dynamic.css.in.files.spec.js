describe("Should skip the processing of null values", function() {

	var api = require('../../../index.js')();

	it("should compile properly", function(done) {
		api.import(__dirname + '/main.js').compile(function(err, css) {
			expect(css).toBe('body{font-size: 30px;line-height: 40px;}.Nav-Top-_Link{color: red;}.Nav-Bottom-_Link{color: blue;}');
			done();
		}, { minify: true})
	});

});