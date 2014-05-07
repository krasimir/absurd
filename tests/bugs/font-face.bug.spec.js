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

});