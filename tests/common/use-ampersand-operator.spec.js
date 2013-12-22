describe("Use ampersand operator", function() {

	var api = require('../../index.js')();

	it("should use add", function(done) {
		api.add({
			a: {
				color: 'red',
				':hover': { color: 'blue' },
				'&.fancy': { color: 'green' }
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("a {\n  color: red;\n}\na:hover {\n  color: blue;\n}\na.fancy {\n  color: green;\n}\n");
			done();
		})
	});
	
	it("should replace all ampersand with parent selector", function(done) {
		api.add({
			a: {
				color: 'red',
				':hover': { color: 'blue' },
				'&.fancy': { color: 'green' },
				'.ie6 &:hover, .ie7 &:hover': { color: 'orange' },
				'.ie6 &.fancy': { color: 'yellow' },
				'.ie7 &.fancy': { color: 'black' }
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('a{color: red;}a:hover{color: blue;}a.fancy{color: green;}.ie6 a:hover,.ie7 a:hover{color: orange;}.ie6 a.fancy{color: yellow;}.ie7 a.fancy{color: black;}');
			done();
		}, { minify: true })
	});

});