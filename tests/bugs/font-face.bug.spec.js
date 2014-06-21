describe("Should add two @font-face", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			"@font-face": {
		        fontFamily: "chinese_rocks_rg",
		        src: "url('../fonts/chinese_rocks_rg.woff') format('woff'), url(../fonts/chinese_rocks_rg.ttf) format('truetype')"
		    },
		    "%test%@font-face": {
		        fontFamily: "PENSHURS",
		        src: "url('../fonts/PENSHURS.woff') format('woff'), url(../fonts/PENSHURS.ttf) format('truetype')"
		    }
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: chinese_rocks_rg;src: url('../fonts/chinese_rocks_rg.woff') format('woff'),url(../fonts/chinese_rocks_rg.ttf) format('truetype');}@font-face{font-family: PENSHURS;src: url('../fonts/PENSHURS.woff') format('woff'),url(../fonts/PENSHURS.ttf) format('truetype');}");
			done();
		}, { minify: true });
	});
	
	it("should compile properly with three font faces", function(done) {
		api.add({
			'%1%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-light-webfont.eot\')',
			  'font-style': 'normal'
			},
			'%2%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-lightitalic-webfont.eot\')',
			  'font-style': 'italic'
			},
			'%3%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-semibold-webfont.eot\')',
			  'font-weight': '600',
			  'font-style': 'normal'
			}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: 'Titillium';src: url('type/titillium-light-webfont.eot');font-style: normal;}@font-face{font-family: 'Titillium';src: url('type/titillium-lightitalic-webfont.eot');font-style: italic;}@font-face{font-family: 'Titillium';src: url('type/titillium-semibold-webfont.eot');font-weight: 600;font-style: normal;}");
			done();
		}, { minify: true });
	});

	it("should compile properly with three font faces", function(done) {
		api.add({ 
				'@font-face': {
					'font-family': '\'callunaregular\'',
					src: 'url(\'type/calluna.eot\')',
					'font-weight': 'normal',
					'font-style': 'normal'
				},
				'%0%@font-face': { 
					'font-family': '\'museo_sans100\'',
					src: 'url(\'type/museosans.eot\')',
					'font-weight': 'normal',
					'font-style': 'normal'
				}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: 'callunaregular';src: url('type/calluna.eot');font-weight: normal;font-style: normal;}@font-face{font-family: 'museo_sans100';src: url('type/museosans.eot');font-weight: normal;font-style: normal;}");
			done();
		}, { minify: true });
	});

});