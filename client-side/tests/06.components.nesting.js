describe("Testing components (nesting)", function() {

	var absurd = Absurd();

	it("should register two components with same proto", function(done) {
		var proto = {
			prop: 10,
			method: function() {
				this.prop += 1;
				return this;
			}
		}
		var c1 = absurd.components.register("c1", proto)().method();
		var c2 = absurd.components.register("c2", proto)().method().method();
		expect(c1.prop).toBe(11);
		expect(c2.prop).toBe(12);
		done();
	});

	it("should nest components", function(done) {

		var child = absurd.components.register("child", {
			text: "Title",
			html: {
				h1: "<% this.text %>"
			}
		})();
		var parent = absurd.components.register("parent", {
			html: {
				section: [
					"<% this.component('title') %>",
					"<% this.component('title') %>"
				]
			},
			populated: function(data) {
				console.log(data);
				expect(data.html.element.outerHTML).toBe("<section><h1>Title</h1><h1>Title</h1></section>");
				done();
			}
		})().children({
			title: child
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