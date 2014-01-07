describe("Dependency injector", function() {

	var api = require('../../index.js')();

	it("should have the injector API available", function(done) {
		expect(api.di).toBeDefined();
		expect(api.di).not.toBe(null);
		done();
	});

	it("should define a dependency and use it", function(done) {
		api.di.register("AwesomeModule", function() {
			return 42;
		});
		var doSomething = api.di.resolve(function(AwesomeModule) {
			expect(AwesomeModule()).toBe(42);
			done();
		});
		doSomething();
	});

	it("should use other parameters", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 30;
		});
		var doSomething = api.di.resolve(function(a, AwesomeModule, b) {
			expect(a).toBe(2);
			expect(b).toBe(10);
			expect(AwesomeModule() + a + b).toBe(42);
			done();
		});
		doSomething(2, 10);
	});

	it("should protect from minification", function(done) {
		api.di.flush()
		.register("AwesomeModule", function() {
			return 30;
		})
		.register("UselessModule", function() {
			return 'absolutely nothing';
		});

		var doSomething = api.di.resolve(',AwesomeModule,,UselessModule', function(a, AwesomeModule, b, UselessModule) {
			expect(a).toBe(2);
			expect(b).toBe(10);
			expect(AwesomeModule() + a + b).toBe(42);
			expect(UselessModule()).toBe('absolutely nothing');
			done();
		});
		doSomething(2, 10);
	});

	it("should keep the scope", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 42;
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: function(AwesomeModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				done();
			}
		}
		component.doSomething = api.di.resolve(component.doSomething, component);
		component.doSomething();
	});

	it("should resolve an object", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 42;
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: function(AwesomeModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				done();
			}
		}
		api.di.resolveObject(component);
		component.doSomething();
	});

	it("should resolve an object protected from minification", function(done) {
		api.di.flush()
		.register("AwesomeModule", function() {
			return 42;
		})
		.register("UselessModule", function() {
			return 'absolutely nothing';
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: ['AwesomeModule, UselessModule', function(AwesomeModule, UselessModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				expect(UselessModule()).toBe("absolutely nothing");
				done();
			}]
		}
		api.di.resolveObject(component);
		component.doSomething();
	});

});