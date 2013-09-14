describe("Extending", function() {

	var Absurd = require('../index.js');

	it("should extend Absurd", function(done) {
		Absurd(function(api) {
			api.plugin('my-custom-gradient', function(colors) {
				return {
					background: 'linear-gradient(to bottom, ' + colors.join(", ") + ')'
				};
			});
			api.plugin('brand-font-size', function(type) {
				switch(type) {
					case "small": return { 'font-size': '12px'}; break;
					case "medium": return { 'font-size': '22px'}; break;
					case "big": return { 'font-size': '32px'}; break;
					default: return { 'font-size': '12px'}; break;
				}
			});
			api.add({
				body: {
					margin: '20px',
					'font-size': '14px',
					'my-custom-gradient': ['#F00', '#00F'],
					p: {
						'brand-font-size': 'big'	
					}					
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  margin: 20px;\n  font-size: 14px;\n  background: linear-gradient(to bottom, #F00, #00F);\n}\nbody p {\n  font-size: 32px;\n}\n');
			done();
		});		
	});

});