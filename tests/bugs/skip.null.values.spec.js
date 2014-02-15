describe("Should skip the processing of null values", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
		    body: {
		        marginTop: null,
		        width: "100%",
		        p: {
		        	span: {
		        		fontSize: '20px',
		        		display: null,
		        		fontWeight: false
		        	}
		        }
		    },
		    header: {
		        width: "100%"
		    }
		}
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('body,header{width: 100%;}body p span{font-size: 20px;}');
			done();
		}, { minify: true });
	});

});