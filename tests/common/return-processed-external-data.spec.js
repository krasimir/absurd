describe("Should return the processed external data", function() {

	var api = require('../../index.js')();

	it("should use the import method", function(done) {
		var result = api.import(__dirname + '/../data/css/header.js', {minify: true});
        expect(result).toContain('background: #BADA55');
		expect(result).toContain('height: 97%');
        done();
	});

});
