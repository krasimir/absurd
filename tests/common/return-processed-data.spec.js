describe("Should return the processed data", function() {

	var api = require('../../index.js')();

	it("should use the compile method", function(done) {
		var result = api.add({
		    body: {
		    	fz: '20px'
		    }
		}).compile(null, { minify: true });
		expect(result).toBe('body{font-size: 20px;}');
		done();
	});

});