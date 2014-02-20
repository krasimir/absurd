describe("Testing components (is)", function() {

	it("should use is.appended", function(done) {
		absurd.component('TestingIsAppended', {
			html: 'body',
			constructor: function(is) {
				expect(is.appended()).toBe(true);
				done();
			}
		})();
	});

	it("should use is.appended with falsy result", function(done) {
		absurd.component('TestingIsAppended', {
			constructor: function(is) {
				expect(is.appended()).toBe(false);
				done();
			}
		})();
	});

});