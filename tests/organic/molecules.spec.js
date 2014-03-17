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
			expect(css).toBe('p{transform: translate3d(10px,20px,30px);-webkit-transform: translate3d(10px,20px,30px);-ms-transform: translate3d(10px,20px,30px);}');
			done();
		}, { minify: true })
	});

	it("should use rotateto", function(done) {
		api.add({
			'.content': {
				rotateto: 25,
				section: {
					rotateto: '-30deg',
				},
				a: {
					rotateto: '10',
					moveto: '20/30'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('.content{transform: rotate(25deg);-webkit-transform: rotate(25deg);-ms-transform: rotate(25deg);}.content section{transform: rotate(-30deg);-webkit-transform: rotate(-30deg);-ms-transform: rotate(-30deg);}.content a{transform: rotate(10deg) translate(20px,30px);-webkit-transform: rotate(10deg) translate(20px,30px);-ms-transform: rotate(10deg) translate(20px,30px);}');
			done();
		}, { minify: true })
	});

	it("should use scaleto", function(done) {
		api.add({
			p: {
				scaleto: '1.4/1.3',
				moveto: '30/0'
			}
		}).compile(function(err, css) {
			expect(css).toBe('p{transform: scale(1.4,1.3) translate(30px,0px);-webkit-transform: scale(1.4,1.3) translate(30px,0px);-ms-transform: scale(1.4,1.3) translate(30px,0px);}');
			done();
		}, { minify: true });
	});

	it("should use grid", function(done) {
		api.add({
			'section.container': {
				grid: '3/div'
			}
		}).compile(function(err, css) {
			expect(css).toBe('section.container:before,section.container:after{content: " ";display: table;clear: both;}section.container div{float: left;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;width: 33.33%;}');
			done();
		}, { minify: true });
	});

	it("should use transparent", function(done) {
		api.add({
			'section.container': {
				transparent: 0.4
			}
		}).compile(function(err, css) {
			expect(css).toBe('section.container{filter: alpha(opacity=40);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);opacity: 0.4;-moz-opacity: 0.4;-khtml-opacity: 0.4;}');
			done();
		}, { minify: true });
	});

	it("should use gradient", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(0deg,#F00 0%,#00F 100%);background: -moz-linear-gradient(0deg,#F00 0%,#00F 100%);background: -ms-linear-gradient(0deg,#F00 0%,#00F 100%);background: -o-linear-gradient(0deg,#F00 0%,#00F 100%);background: linear-gradient(0deg,#F00 0%,#00F 100%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF0000FF',endColorstr='#FFFF0000',GradientType=0);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF0000FF',endColorstr='#FFFF0000',GradientType=0);}");
			done();
		}, { minify: true });
	});

	it("should use gradient with angle", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F/#0F0/75deg'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -moz-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -ms-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -o-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);}");
			done();
		}, { minify: true });
	});

	it("should use gradient with angle and specific stops position", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F 5%/#BADA55 95%/#0F0/75deg'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -moz-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -ms-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -o-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);}");
			done();
		}, { minify: true });
	});

	it("should use blur", function(done) {
		api.add({
			'.container': {
				blur: 10
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: blur(10px);-webkit-filter: blur(10px);-moz-filter: blur(10px);-ms-filter: blur(10px);}");
			done();
		}, { minify: true });
	});

	it("should use brightness", function(done) {
		api.add({
			'.container': {
				brightness: 0.5
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: brightness(0.5);-webkit-filter: brightness(0.5);-moz-filter: brightness(0.5);-ms-filter: brightness(0.5);}");
			done();
		}, { minify: true });
	});

	it("should use contrast", function(done) {
		api.add({
			'.container': {
				contrast: 230
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: contrast(230%);-webkit-filter: contrast(230%);-moz-filter: contrast(230%);-ms-filter: contrast(230%);}");
			done();
		}, { minify: true });
	});

	it("should use invert", function(done) {
		api.add({
			'.container': {
				invert: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: invert(80%);-webkit-filter: invert(80%);-moz-filter: invert(80%);-ms-filter: invert(80%);}");
			done();
		}, { minify: true });
	});

	it("should use saturate", function(done) {
		api.add({
			'.container': {
				saturate: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: saturate(80deg);-webkit-filter: saturate(80deg);-moz-filter: saturate(80deg);-ms-filter: saturate(80deg);}");
			done();
		}, { minify: true });
	});

	it("should use sepia", function(done) {
		api.add({
			'.container': {
				sepia: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: sepia(80%);-webkit-filter: sepia(80%);-moz-filter: sepia(80%);-ms-filter: sepia(80%);}");
			done();
		}, { minify: true });
	});

	it("should use calc", function(done) {
		api.add({
			'.container': {
				calc: 'width/100% - 45px'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{-lh-property: 0;width: -webkit-calc(100% - 45px);width: -moz-calc(100% - 45px);width: calc(100% - 45px);}");
			done();
		}, { minify: true });
	});

	it("should use dropshadow", function(done) {
		api.add({
			'.container': {
				dropshadow: '16px 16px 10px #000000'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: drop-shadow(16px 16px 10px #000000);-webkit-filter: drop-shadow(16px 16px 10px #000000);-moz-filter: drop-shadow(16px 16px 10px #000000);-ms-filter: drop-shadow(16px 16px 10px #000000);}");
			done();
		}, { minify: true });
	});

	it("should use trsform", function(done) {
		api.add({
			'.container': {
				trsform: 'rotate(-20deg) scale(1.2, 1.2)'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{transform: rotate(-20deg) scale(1.2,1.2);-webkit-transform: rotate(-20deg) scale(1.2,1.2);-moz-transform: rotate(-20deg) scale(1.2,1.2);-ms-transform: rotate(-20deg) scale(1.2,1.2);-o-transform: rotate(-20deg) scale(1.2,1.2);}");
			done();
		}, { minify: true });
	});

});