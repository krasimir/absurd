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
			expect(css).toBe("a {\n  color: red;\n}\na.fancy {\n  color: green;\n}\na:hover {\n  color: blue;\n}\n");
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
			expect(css).toBe('a{color: red;}.ie7 a.fancy{color: black;}.ie6 a.fancy{color: yellow;}.ie7 a:hover,.ie6 a:hover{color: orange;}a.fancy{color: green;}a:hover{color: blue;}');
			done();
		}, { minify: true })
	});

});