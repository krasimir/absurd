describe("Testing components events", function() {

	var absurd = Absurd();

	it("should register events", function(done) {
		absurd.components.register("TestingEvents", {
			title: '',
			css: {
				'#testing-events-form': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form': {
					p: '<% this.title %>',
					'input[type="text" data-absurd-event="keyup:handler"]': ''
				}
			},
			handler: function(e) {
				this.title = e.target.value;
				this.populate();
			},
			populated: function(data) {
				if(!this.tested) {
					var input = data.html.element.querySelector("input");
					input.value = "42";
					this.tested = true;
					fireEvent(input, "keyup");
				} else {
					expect(data.html.element.querySelector("p").innerHTML).toBe("42");
					done();
				}				
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should register two components and broadcast a message", function(done) {
		var c =0, count = function() {
			c += 1;
			if(c == 2) done();
		}
		absurd.components.flush();
		absurd.components.register("c1", { omg: function() { count(); } })();
		absurd.components.register("c2", { omg: function() { count(); } })();
		absurd.components.broadcast("omg");
	});

	it("should send a message from one component to another", function(done) {
		var a = absurd.component("ComponentA", {
			go: function() {
				this.dispatch("update", {value: 1})
				this.dispatch("update2", {value: 2})
			}
		})();
		var b = absurd.component("ComponentB", {
			value: 0,
			update: function(data) {
				this.value += data.value;
			},
			update2: function(data) {
				this.value += data.value;
				expect(data.value).toBe(2);
				expect(this.value).toBe(3);
				expect(this.__name).toBe("ComponentB");
				done();
			}
		})();
		b.wire("update");
		absurd.components.events.on('update2', b.update2, b);
		a.go();
	});

	it("should pass a primitive data", function(done) {
		absurd.components.flush().register("c1", { 
			run: function() {
				this.dispatch("event", 100)
			},
			event: function(data) {
				expect(data).toBe(100);
				done();
			}
		})().run();
	});

	it("should pass an array", function(done) {
		absurd.components.flush().register("c1", { 
			run: function() {
				this.dispatch("event", ['a', 'b'])
			},
			event: function(data) {
				expect(data.length).toBe(2);
				expect(data[0]).toBe('a');
				expect(data[1]).toBe('b');
				done();
			}
		})().run();
	});

});