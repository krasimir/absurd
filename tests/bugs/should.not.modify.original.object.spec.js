describe("Should not modify the original object", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
			body: {
				p: {
					fontSize: '20px',
					span: {
						display: 'block'
					}
				}
			}
		}
		api.add(styles).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body p{font-size: 20px;}body p span{display: block;}");
			expect(styles.body.p).not.toBe(false);
			done();
		}, { minify: true });
	});

});