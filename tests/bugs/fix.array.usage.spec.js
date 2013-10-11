describe("Fixing bug in array usage", function() {

	var Absurd = require('../../index.js');
	var themeColor = "#BADA55";
	var textStyles = function(size) {
		return {
			color: themeColor,
			fontSize: size + "px",
			lineHeight: size + "px"
		}
	}

	it("should use array", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
					color: themeColor,
					p: textStyles(16),
					h1: [
						textStyles(50),
						{
							lineHeight: "60px"
						} 
					]
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body, body p, body h1 {\n  color: #BADA55;\n}\nbody p {\n  font-size: 16px;\n  line-height: 16px;\n}\nbody h1 {\n  font-size: 50px;\n  line-height: 60px;\n}\n");
			done();
		});		
	});

});