describe("Can't compile atoms and molecules in keyframes", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		api.add({
			'-w-keyframes': {
				name: "hide-preloader",
				frames: {
					"0%": { 
						transparent: 1,
						moveto: '0/0'
					},
					"100%": { 
						transparent: 0,
						'-wms-trf': 'translate(0px,-40px)'
					}
				}
			}
		})
		api.compile(function(err, css) {
			expect(css).toBe('@keyframes hide-preloader {0%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;transform: translate(0px,0px);-webkit-transform: translate(0px,0px);-ms-transform: translate(0px,0px);}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;transform: translate(0px,-40px);-webkit-transform: translate(0px,-40px);-moz-transform: translate(0px,-40px);-ms-transform: translate(0px,-40px);}}@-webkit-keyframes hide-preloader {0%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;transform: translate(0px,0px);-webkit-transform: translate(0px,0px);-ms-transform: translate(0px,0px);}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;transform: translate(0px,-40px);-webkit-transform: translate(0px,-40px);-moz-transform: translate(0px,-40px);-ms-transform: translate(0px,-40px);}}');
			done();
		}, {minify: true});
	})

});