describe("Testing components", function() {

	it("should have .components API available", function(done) {
		expect(absurd.components).toBeDefined();
		done();
	});

	it("should register a component and the answer is 42", function(done) {
		var widget = absurd.components.register("widget", {
			customMethod: function() {
				return "custom method";
			}
		}).on("custom-event", function(data) {
			expect(data.prop).toBe(42);
			done();
		});
		expect(widget.customMethod()).toBe("custom method");
		absurd.components.get("widget").dispatch("custom-event", {prop: 42});
	});	

	it("should register and remove a component", function(done) {
		absurd.components.flush().register("comp42");
		expect(absurd.components.list() instanceof Array).toBeTruthy();
		expect(absurd.components.list().length > 0).toBeTruthy();
		absurd.components.remove("comp42");
		expect(absurd.components.list().length).toBe(0);
		done();
	});

	it("should register two components and broadcast a message", function(done) {
		var c =0, count = function() {
			c += 1;
			if(c == 2) done();
		}
		absurd.components.flush();
		absurd.components.register("c1", { omg: function() { count(); } });
		absurd.components.register("c2", { omg: function() { count(); } });
		absurd.components.broadcast("omg");
	});

});