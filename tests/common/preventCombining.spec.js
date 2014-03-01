describe("Prevent combining certain properties", function() {

	var absurd = require("../../index.js")();

	it("should use nesting", function(done) {
		absurd.add({
			body: {
				width: '100px',
				fz: '18px',
				mar: '2px 3px 0 0',
				p: {
					fz: '20px'
				},
				span: {
					d: 'b'
				}
			}
		}).add({
			section: {
				wid: '100px',
				fz: '20px',
				a: {
					pad: '0 0 0 10px',
					fz: '20px',
					d: 'b'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{font-size: 18px;margin: 2px 3px 0 0;}body,section{width: 100px;}body p{font-size: 20px;}body span{display: block;}section{font-size: 20px;}section a{padding: 0 0 0 10px;font-size: 20px;display: block;}');
			done();
		}, {
			minify: true,
			preventCombining: ['font-size', 'display']
		});
	});

	it("should prevent the combining of a selector", function(done) {
		absurd.flush().add({
			'.content': {
				mar: 0,
				fz: '10px'
			}
		});
		absurd.add({
			'.content': {
				pad: 0,
				fz: '20px'
			}
		}, { preventCombining: ['.content'] }).compile(function(err, css) {
			expect(css).toBe('.content{margin: 0;font-size: 10px;}.content{padding: 0;font-size: 20px;}')
			done();
		}, {
			minify: true
		});
	});

	it("should prevent the combining of a @font-size", function(done) {
		absurd.flush().add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				src: "url('/fonts/Museo Sans/MuseoSans_500.otf')", 
			}
		});
		absurd.add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				fontStyle: 'italic, oblique',
				src: "url('/fonts/Museo Sans/MuseoSans_500_italic.otf')"
			}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: MuseoSans;src: url('/fonts/Museo Sans/MuseoSans_500.otf');}@font-face{font-family: MuseoSans;font-style: italic,oblique;src: url('/fonts/Museo Sans/MuseoSans_500_italic.otf');}")
			done();
		}, {
			minify: true
		});
	});

	it("should prevent the combining of a @font-size with other classes", function(done) {
		absurd.flush().add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				src: "url('/fonts/Museo Sans/MuseoSans_500.otf')", 
			},
			'.content': {
				fz: '10px'
			}
		}, { preventCombining: ['.content'] });
		absurd.add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				fontStyle: 'italic, oblique',
				src: "url('/fonts/Museo Sans/MuseoSans_500_italic.otf')"
			},
			'.content': {
				fz: '20px'
			}
		}, { preventCombining: ['.content']}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: MuseoSans;src: url('/fonts/Museo Sans/MuseoSans_500.otf');}.content{font-size: 10px;}@font-face{font-family: MuseoSans;font-style: italic,oblique;src: url('/fonts/Museo Sans/MuseoSans_500_italic.otf');}.content{font-size: 20px;}")
			done();
		}, {
			minify: true
		});
	});

});