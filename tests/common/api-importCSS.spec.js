describe("Should use import CSS", function() {

	var api = require('../../index.js')();
	var css = '\
	.header {\
		margin: 0;\
		font-size: 20px;\
	}\
	.header p {\
		line-height: 22px;\
	}\
	@media all and (max-width: 460px) {\
		.header p {\
			line-height: 33px;\
			color: #000;\
		}\
	}';

	it("should compile properly", function(done) {
		api
		.importCSS(css)
		.add({ '.header': { mar: '10px 20px' }})
		.add({ '.header p': { color: '#FFF' }})
		.compile(function(err, css) {
			expect(css).toBe('.header{margin: 10px 20px;font-size: 20px;}.header p{line-height: 22px;color: #FFF;}@media all and (max-width: 460px) {.header p{line-height: 33px;color: #000;}}');
			done();
		}, { minify: true });
	});

});