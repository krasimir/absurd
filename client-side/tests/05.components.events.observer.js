describe("Testing components Observer", function() {

	var extend = function() {
		var process = function(destination, source) {	
		    for (var key in source) {
				if (hasOwnProperty.call(source, key)) {
				    destination[key] = source[key];
				}
		    }
		    return destination;
		};
		var result = arguments[0];
		for(var i=1; i<arguments.length; i++) {
			result = process(result, arguments[i]);
		}
		return result;
	}

	it("should attach a listener and dispatch an event", function(done) {
		var observer = absurd.component("Observer", {})();
		observer.on("event", function(data) {
			expect(data.value).toBe(10);
			done();
		}).dispatch("event", { value: 10 });
	});

	it("should remove a listener", function(done) {
		var observer = absurd.component("Observer", {})();
		var listener = function() {};
		observer.on("event", listener);
		expect(observer.listeners['event'].length === 1).toBe(true);
		observer.off("event");
		expect(observer.listeners['event'].length === 0).toBe(true);
		done();
	});

	it("should keep the scope (passed on 'dispatch' method)", function(done) {
		var observer = absurd.component("Observer", {})();
		var component = extend({}, observer);
		component.name = 'Component';
		component.on('event', function(data) {
			expect(data.value).toBe(10);
			expect(this.name).toBe('Component');
			done();
		}).dispatch('event', { value: 10 }, component);
	});

	it("should keep the scope (passed on 'on' method)", function(done) {
		var observer = absurd.component("Observer", {})();
		var component = extend({}, observer);
		component.name = 'Component';
		component.on('event', function(data) {
			expect(data.value).toBe(10);
			expect(this.name).toBe('Component');
			done();
		}, component).dispatch('event', { value: 10 });
	});

});