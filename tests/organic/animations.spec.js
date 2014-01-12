describe("Animations", function() {

	var api = require('../../index.js')();

	it("should set animation property", function(done) {
		api.add({
			div: {
				animate: 'nameAnimation 2s linear alternate'
			}
		}).compile(function(err, css) {
			expect(css).toBe('div{animation: nameAnimation 2s linear alternate;-webkit-animation: nameAnimation 2s linear alternate;-moz-animation: nameAnimation 2s linear alternate;-o-animation: nameAnimation 2s linear alternate;}');
			done();
		}, { minify: true});
	});

	it("should use bounce", function(done) {
		api.add({
			div: {
				'&:hover': {
					animate: 'bounce'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes bounce {0%,20%,50%,80%,100%{transform: translateY(0);-webkit-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);}}@-webkit-keyframes bounce {0%,20%,50%,80%,100%{transform: translateY(0);-webkit-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);}}div:hover{animation-duration: 1s;-webkit-animation-duration: 1s;animation-fill-mode: both;-webkit-animation-fill-mode: both;animation-name: bounce;-webkit-animation-name: bounce;}');
			done();
		}, { minify: true });
	});

})