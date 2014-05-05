describe("Fixing browser prefixes bug - ", function() {

	var Absurd = require('../../index.js');

	it("should compile properly", function(done) {
		Absurd(function(api) {
			api.add({
				header: {
					"animation-name": "test",
					"-moz-animation-name": "test",
					"-webkit-animation-name": "test",
					"-ms-animation-name": "test",
					"-o-animation-name": "test"
			    }
			});
		}).compile(function(err, css) {
			expect(css).toBe('header{animation-name: test;-moz-animation-name: test;-webkit-animation-name: test;-ms-animation-name: test;-o-animation-name: test;}');
			done();
		}, {minify: true});		
	});

});