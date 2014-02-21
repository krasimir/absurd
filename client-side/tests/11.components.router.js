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
	});

	it("should keep the scope", function(done) {
		absurd.component('TestingRouter', {
			constructor: function(router) {
				router.flush().add(function() {
					expect(this.__name).toBe('TestingRouter');
					done();
				}).check();
			}
		})();
	});

	it("should get params and back to home", function(done) {
		var productId = 567, action = 'edit';
		absurd.component('TestingRouterCrazy', {
			goBackToHome: function(router, id, action) {
				expect(parseInt(id)).toBe(productId);
				expect(action).toBe(action);
				router.navigate().check();
			},
			home: function() {
				expect(this.__name).toBe('TestingRouterCrazy');
				done();
			},
			constructor: function(router) {
				router.flush().add(/products\/(.*)\/(.*)$/, this.goBackToHome).add(this.home);
				if(window.location.href.indexOf('#/products') < 0) {
					window.location.href = window.location.href + '#/products/' + productId + '/' + action + '/';
				}
				router.check();
			}
		})();
	});

});