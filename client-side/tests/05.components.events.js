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
				this.dispatch("update", {value: 42})
			}
		})();
		var b = absurd.component("ComponentB", {
			update: function(data) {
				expect(data.value).toBe(42);
				expect(this.name).toBe("ComponentB");
				done();
			}
		})();
		b.wire("update");
		a.go();
	});

});