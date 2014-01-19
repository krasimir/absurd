describe("Ampersand and nesting", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			body: {
		        marginTop: "20px",
		        width: "100%",
		        section: {
		        	'&, &:hover, p, .cls4': {
		        		lineHeight: '20px'
		        	}
		        }
		    },
		    header: {
		        width: "100%",
		        '&, .cls2, .cls3': {
		            color: "red"
		        }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body{margin-top: 20px;}body,header{width: 100%;}body section,body section:hover,body section p,body section .cls4{line-height: 20px;}header,header .cls2,header .cls3{color: red;}');
			done();
		}, { minify: true });
	});

});