describe("Should call animate without holder", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
			animate: ['show', {
				'0%': { color: '#FFF' },
				'100%': { color: '#000' }
			}]
		}
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('@keyframes show {0%{color: #FFF;}100%{color: #000;}}@-webkit-keyframes show {0%{color: #FFF;}100%{color: #000;}}');
			done();
		}, { minify: true });
	});

});