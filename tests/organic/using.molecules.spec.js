describe("Testing molecules", function() {

	var api = require('../../index.js')();

	it("should use size", function(done) {
		api.add({
			body: {
				size: 100,
				p: {
					size: '30/40'
				},
				section: {
					size: '/200px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{width: 100%;height: 100%;}body p{width: 30%;height: 40%;}body section{height: 200px;}');
			done();
		}, { minify: true})
	});

	it("should use metrics", function(done) {
		api.add({
			body: {
				metrics: '20px',
				p: {
					metrics: '10px 20px/2px'
				},
				section: {
					metrics: '/0 0 20px 0'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{margin: 20px;padding: 20px;}body p{margin: 10px 20px;padding: 2px;}body section{padding: 0 0 20px 0;}');
			done();
		}, { minify: true})
	});

	it("should use cf", function(done) {
		api.add({
			body: {
				cf: 'all',
				p: {
					cf: 'before'
				},
				section: {
					cf: 'after'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body:before,body:after,body p:before,body section:after{content: " ";display: table;clear: both;}');
			done();
		}, { minify: true })
	});

	it("should use moveto", function(done) {
		api.add({
			p: {
				moveto: '10/20/30'
			}
		}).compile(function(err, css) {
			expect(css).toBe('p{transform: translate3d(10,20,30);-webkit-transform: translate3d(10,20,30);-ms-transform: translate3d(10,20,30);}');
			done();
		}, { minify: true })
	});

});