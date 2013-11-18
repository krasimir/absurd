describe("Using mixins", function() {

	var Absurd = require("../../index.js");

	it("should use a mixin", function(done) {

		var absurd = Absurd();

		absurd.storage("button", function(color, thickness) {
			return {
				color: color,
				display: "inline-block",
				padding: "10px 20px",
				border: "solid " + thickness + "px " + color,
				'font-size': "10px"
			}
		});

		absurd.add({
			'.header-button': [
				absurd.storage("button")("#AAA", 10),
				{
					color: '#F00',
					'font-size': '13px'
				}
			]
		});

		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('font-size: 13px;');
			expect(css).toContain('color: #F00;');
			expect(css).not.toContain('color: #AAA;');
			done();
		})

	});

	it("should pass multiple values to storage", function(done) {
		var api = Absurd();
		api.storage({
			red: '#FF0000',
			green: '#00FF00',
			blue: '#0000FF',
			darkRed: '#550000',
			uselessMixin: function(v){
				return v;
			}
		});
		api.add({
			body: [
				{ color: api.storage("red") },
				{ background: api.storage("green") },
				api.storage("uselessMixin")({ width: "100%", height: "100%"})
			]
		});
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n\
  color: #FF0000;\n\
  background: #00FF00;\n\
  width: 100%;\n\
  height: 100%;\n\
}\n");
			done();
		})
	});

})