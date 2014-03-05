describe("Should report errors properly", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		try {
			api.add({
			    body: {
			    	width: undefined,
			    	padding: '20px'
			    }
			}).compile(function(err, css) {
				console.log(css);			
				done();
			}, { minify: false });
		} catch(err) {
			expect(err.toString().indexOf('Error: Error adding: {"rules":{"body":{"padding":"20px"}}') >= 0).toBe(true);
			done();
		}
	});

});