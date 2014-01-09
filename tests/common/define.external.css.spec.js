describe(".define function", function() {

	var api = require('../../index.js')();

	it("should use define and external css file", function(done) {
		api.flush().define("brand-color", function() {
			return '#BADA55';
		});
		api.import(__dirname + '/../data/css/define.css').compile(function(err, css) {
			expect(css).toBe('body{color: #BADA55;}p{border-top: 1px solid #BADA55;}');
			done();
		}, { minify: true });
	});

});