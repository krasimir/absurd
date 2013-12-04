describe("Allow nested objects in arrays", function() {

	var api = require('../../index.js')();

	it("use nested objects in array", function(done) {
		api.add({
		    body: [
		    	{ width: '80px' },
		    	{ span: { display: 'inline' } },
		    	{ 
		    		section: {
		    			fontSize: "23px"
		    		},
		    		ul: [
		    			{ margin: "10px" },
		    			{ a: { color: "blue" } },
		    			{ padding: "20px" }
		    		]
		    	}
		    ]
	}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{width: 80px;}body span{display: inline;}body section{font-size: 23px;}body ul{margin: 10px;padding: 20px;}body ul a{color: blue;}");
			done();
		}, {minify: true});
	});

});