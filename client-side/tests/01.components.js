describe("Testing components", function() {

	it("should have .components API available", function(done) {
		expect(absurd.components).toBeDefined();
		expect(absurd.component).toBeDefined();
		done();
	});

	it("should register a component and the answer is 42", function(done) {
		var widget = absurd.component("widget", {
			customMethod: function() {
				return "custom method";
			}
		})();
		widget.on("custom-event", function(data) {
			expect(data.prop).toBe(42);
			done();
		});
		expect(widget.customMethod()).toBe("custom method");
		widget.dispatch("custom-event", {prop: 42});
	});	

	it("should register and remove a component", function(done) {
		absurd.components.flush().register("comp42");
		expect(absurd.components.list() instanceof Array).toBeTruthy();
		expect(absurd.components.list().length > 0).toBeTruthy();
		absurd.components.remove("comp42");
		expect(absurd.components.list().length).toBe(0);
		done();
	});

	it("should create a component and call its constructor", function(done) {
		var Component = absurd.component("ComponentCreation", {
			constructor: function(a, b, c) {
				expect(this.__name).toBe("ComponentCreation");
				expect(a).toBe(10);
				expect(b).toBe(20);
				expect(c).toBe(30);
				done();
			}
		})
		Component(10, 20, 30);
	});

});