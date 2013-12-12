describe("Testing nesting of components", function() {

	var absurd = Absurd();

	xit("should register two components with same proto", function(done) {
		var proto = {
			prop: 10,
			method: function() {
				this.prop += 1;
				return this;
			}
		}
		var c1 = absurd.components.register("c1", proto).method();
		var c2 = absurd.components.register("c2", proto).method().method();
		expect(c1.prop).toBe(11);
		expect(c2.prop).toBe(12);
		done();
	});

	xit("should nest components", function(done) {

		var title = absurd.components.register("title", {
			html: {
				h1: "Title"
			}
		});
		var parent = absurd.components.register("parent", {
			html: {
				section: "<% this.include('title') %>"
			},
			populated: function(data) {
				expect(data.html).toBe("<section><h1>Title</h1></section>");
				done();
			}
		});

		parent.populate();

	});

	xit("should nest components and make the child self updated", function(done) {

		var child = absurd.components.register("child", {
			username: "User",
			html: {
				h1: {
					span: "Hello <% this.username %>!"
				}
			},
			populated: function(data) {
				console.log("child populated", data.html);
			}
		});
		var parent = absurd.components.register("parent", {
			html: {
				section: "<% this.include('child') %>"
			},
			populated: function(data) {
				console.log("parent populated", data.html);
			}
		}).populate();

		setTimeout(function() {
			child.username = "World";
			parent.populate();
		}, 500);

	});

});