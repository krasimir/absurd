describe("Fixing allow null values - ", function() {

	var Absurd = require('../../index.js');

	it("allow null in arrays", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
                    span: [{ width: '3px'}, null, {height: '3px'}]
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body span{width: 3px;height: 3px;}");
			done();
		}, {minify: true});
	});

});