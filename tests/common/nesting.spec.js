describe("Nested selectors", function() {

	var Absurd = require("../../index.js");

	it("should use nesting", function(done) {
		Absurd(function(api) {
			api.add({
				'.content': {
					p: {
						'font-size': '16px',
						'text-shadow': '2px 2px #00F',
						a: {
							'text-decoration': 'none',
							span: {
								fontSize: '10px'
							}
						}
					}
				}
				
			})
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('.content p{font-size: 16px;text-shadow: 2px 2px #00F;}.content p a{text-decoration: none;}.content p a span{font-size: 10px;}');
			done();
		}, {minify: true});
	});

});