describe("Testing components (dependency injection)", function() {

	it("should create a dependency and use it", function(done) {
		absurd.di.register("AwesomeModule", absurd.component("AwesomeModule", {
			run: function() {
				this.dispatch("event", 42)
			}
		})());
		var App = absurd.component("Application", {
			init: function(AwesomeModule) {
				expect(AwesomeModule).toBeDefined();
				AwesomeModule.on("event", function(data) {
					expect(data).toBe(42);
					done();
				});
				AwesomeModule.run();
			}
		});
		App().init();
	});

	it("should protect from minification", function(done) {
		absurd.di.register("AwesomeModule", absurd.component("AwesomeModule", {
			run: function() {
				this.dispatch("event", 42)
			}
		})());
		var App = absurd.component("Application", {
			init: [',AwesomeModule,', function(a, AwesomeModule, b) {
				expect(AwesomeModule).toBeDefined();
				expect(a).toBe("A");
				expect(b).toBe("B");
				AwesomeModule.on("event", function(data) {
					expect(data).toBe(42);
					done();
				});
				AwesomeModule.run();
			}]
		});
		App().init("A", "B");
	});

});