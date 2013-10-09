describe("Media queries", function() {

	var Absurd = require('../../index.js');

	it("Media queries", function(done) {
		Absurd(function(api) {
			api.plugin("brand-color", function(api) {
				return { color: '#9fA' };
			})
			api.add({
				body: {
					'line-height': '20px',
					'@media all (max-width: 950px)': {
						'line-height': '40px',
						color: '#BADA55'
					},
					'@media all (min-width: 550px)': {
						'line-height': '32px'
					},
					p: {
						margin: '10px',
						padding: '4px',
						'@media all (max-width: 950px)': {
							padding: '12px',
							'brand-color': ''
						}
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain("body {\n  line-height: 20px;\n}\nbody p {\n  margin: 10px;\n  padding: 4px;\n}\n@media all (max-width: 950px) {\nbody {\n  line-height: 40px;\n  color: #BADA55;\n}\nbody p {\n  color: #9fA;\n  padding: 12px;\n}\n}\n@media all (min-width: 550px) {\nbody {\n  line-height: 32px;\n}\n}\n");
			done();
		});		
	});

});