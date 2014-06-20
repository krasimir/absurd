describe("Should skip the processing of null values", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			'%0%.grandparent .parent .child': {
				color: '#fff'
			}
		}).compile(function(err, css) {
			expect(css).toBe('.grandparent .parent .child{color: #fff;}');
			done();
		}, { minify: true });
	});

});