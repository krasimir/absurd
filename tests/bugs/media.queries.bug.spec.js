describe("Media queries bugs", function() {

	var api = require('../../index.js')();

	it("should compile media queries properly", function(done) {
		api.add({
			'@media screen and (max-width: 767px)': {
		        a: { color:'red', },
		        div: { color:'blue', },
		        '.some-class': { color:'green' }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("@media screen and (max-width: 767px){a{color: red;}div{color: blue;}.some-class{color: green;}}");
			done();
		}, { minify: true });
	});

	it("should compile media queries properly", function(done) {
		api.add({
			section: {
				'.widget': {
					fontSize: '20px',
					'@media screen and (max-width: 767px)': {
						fontSize: '30px'
					}
				},
				p: {
					'@media screen and (max-width: 767px)': {
						a: { color: 'red' },
						'@media screen and (max-width: 200px)': {
							span: { lineHeight: '10px' }
						}
					}
				}
			},
			'@media screen and (max-width: 767px)': {
		        a: { color:'red', },
		        div: { color:'blue', },
		        '.some-class': { color:'green' }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("section .widget{font-size: 20px;}@media screen and (max-width: 767px){section .widget{font-size: 30px;}section p a,a{color: red;}div{color: blue;}.some-class{color: green;}}@media screen and (max-width: 200px){section p span{line-height: 10px;}}");
			done();
		}, { minify: true });
	});

});