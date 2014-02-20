describe("Testing components (router)", function() {

	it("should have the router as dependency", function(done) {
		absurd.component('TestingRouter', {
			constructor: function(router) {
				expect(router).toBeDefined();
				done();
			}
		})();
	});

	it("should add and remove routes", function(done) {
		absurd.component('TestingRouter', {
			constructor: function(router) {
				var handler = function() { var a = 'a'; };
				router
				.add('/about', function() { var b = 'b'; })
				.add('/', handler);
				expect(router.routes.length).toBe(2);
				router.remove(handler);
				router.remove('/about');
				expect(router.routes.length).toBe(0);
				done();
			}
		})();
	});

	it("should run the router", function(done) {
		absurd.component('TestingRouter', {
			constructor: function(router) {
				expect(router.mode).toBe(null);
				router.config();
				expect(router.mode).toBe('hash');
				done();
			}
		})();
	})

});