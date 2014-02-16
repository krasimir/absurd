describe("Test case (keyframes)", function() {

	var absurd = require('../../../index.js')();

	it("keyframes / js", function(done) {
		absurd.import(__dirname + '/code.js').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {0%{opacity: 0;}10%{opacity: 0;}20%{opacity: 0;}100%{opacity: 1;}}@-webkit-keyframes fade {0%{opacity: 0;}10%{opacity: 0;}20%{opacity: 0;}100%{opacity: 1;}}');
			done();
		}, {minify: true});
	});

	it("keyframes / json", function(done) {
		absurd.import(__dirname + '/code.json').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {0%{opacity: 0;}100%{opacity: 1;}}@-webkit-keyframes fade {0%{opacity: 0;}100%{opacity: 1;}}');
			done();
		}, {minify: true});
	});

	it("keyframes / css", function(done) {
		absurd.import(__dirname + '/code.css').compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@keyframes fade {0%{opacity: 0;}20%{opacity: 0;}100%{opacity: 1;}}@-webkit-keyframes fade {0%{opacity: 0;}20%{opacity: 0;}100%{opacity: 1;}}@keyframes move {from{top: 10px;margin: 20px 0 0 0;}to{top: 12px;margin: 40px 0 0 0;}}@-webkit-keyframes move {from{top: 10px;margin: 20px 0 0 0;}to{top: 12px;margin: 40px 0 0 0;}}');
			done();
		}, {minify: true});
	});

});