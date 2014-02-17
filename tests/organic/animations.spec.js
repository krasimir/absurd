describe("Animations", function() {

	var api = require('../../index.js')();

	it("should use bounce", function(done) {
		api.add({
			div: {
				'&:hover': {
					animate: 'bounce'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes bounce {0%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}20%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}50%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}80%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}100%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);-moz-transform: translateY(-15px);-ms-transform: translateY(-15px);-o-transform: translateY(-15px);}}@-webkit-keyframes bounce {0%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}20%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}50%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}80%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}100%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);-moz-transform: translateY(-15px);-ms-transform: translateY(-15px);-o-transform: translateY(-15px);}}div:hover{animation-name: bounce;-webkit-animation-name: bounce;-moz-animation-name: bounce;-ms-animation-name: bounce;-o-animation-name: bounce;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should define an animation and apply it", function(done) {
		api.flush().add({
			keyframes: {
				name: "preloader",
				frames: {
					"0%": { fz: '10px', margin: 0, pad: '20px' },
					"50%": { fz: '20px', margin: '10px' },
					"100%": { fz: '10px', margin: '20px', pad: '22px' }
				}
			}
		})
		.add({
			'.preloader': {
				animate: {
					name: 'preloader',
					iterationCount: 'infinite'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes preloader {0%{font-size: 10px;padding: 20px;margin: 0;}50%{font-size: 20px;margin: 10px;}100%{font-size: 10px;padding: 22px;margin: 20px;}}@-webkit-keyframes preloader {0%{font-size: 10px;padding: 20px;margin: 0;}50%{font-size: 20px;margin: 10px;}100%{font-size: 10px;padding: 22px;margin: 20px;}}.preloader{animation-name: preloader;-webkit-animation-name: preloader;-moz-animation-name: preloader;-ms-animation-name: preloader;-o-animation-name: preloader;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;-moz-animation-iteration-count: infinite;-ms-animation-iteration-count: infinite;-o-animation-iteration-count: infinite;}');
			done();
		}, { minify: true });
	});

	it("should use blink", function(done) {
		api.add({
			div: {
				animate: 'blink'
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes blink {0%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}50%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;}}@-webkit-keyframes blink {0%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}50%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;}}div{animation-name: blink;-webkit-animation-name: blink;-moz-animation-name: blink;-ms-animation-name: blink;-o-animation-name: blink;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should define an animation with animate method", function(done) {
		api.add({
			div: {
				animate: {
					name: 'awesome-anim',
					frames: {
						'0%': { fz: '10px' },
						'100%': { fz: '20px' }
					}
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}@-webkit-keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}div{animation-name: awesome-anim;-webkit-animation-name: awesome-anim;-moz-animation-name: awesome-anim;-ms-animation-name: awesome-anim;-o-animation-name: awesome-anim;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should only define an animation with animate method", function(done) {
		api.add({
			div: {
				animate: ['awesome-anim', {
					'0%': { fz: '10px' },
					'100%': { fz: '20px' }
				}]
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}@-webkit-keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}');
			done();
		}, { minify: true });
	});

})