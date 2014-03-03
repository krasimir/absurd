describe("Should not print empty selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {};
		styles['.system'] = {
			'&:before': {
				position: 'absolute',
				color: 'red',
				content: 'SS',
			},
			'&-shields': {
			}
		};
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('.system:before{position: absolute;color: red;content: SS;}');
			done();
		}, { minify: true });
	});

});