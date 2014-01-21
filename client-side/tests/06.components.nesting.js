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

		var Child = absurd.component("child", {
			text: "Title",
			html: {
				'h1[data-absurd-event="click:handler"]': "<% this.text %>"
			},
			handler: function(e) {
				this.text = "Wow!!!";
				this.populate();
			}
		});
		var parent = absurd.component("parent", {
			html: {
				section: [
					"<% this.child('title1') %>",
					"<% this.child('title2') %>"
				]
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					expect(data.html.element.outerHTML).toBe('<section><h1 data-absurd-event="click:handler">Title</h1><h1 data-absurd-event="click:handler">Title</h1></section>');
					this.get("children").title1.text = "New Title!";
					this.get("children").title2.text = "New Title!";
					this.populate();
				} else {
					expect(data.html.element.outerHTML).toBe('<section><h1 data-absurd-event="click:handler">New Title!</h1><h1 data-absurd-event="click:handler">New Title!</h1></section>');
					done();
				}				
			}
		})().set("children", {
			title1: Child(),
			title2: Child()
		});

		parent.populate();

	});

	it("should nest components with tables involved", function(done) {
		absurd.components.flush();
		var Child = absurd.component("Child", {
			html: {
				tr: [
					'<td class="c1"><% this.name %></td>',
					'<td class="c2">test</td>'
				]
			},
			constructor: function(data) {
				this.name = data.name;
			}
		});
		absurd.component("Parent", {
			html: {
				'table': [
					'<% this.child("home") %>',
					'<% this.child("away") %>'
				]
			},
			constructor: function() {
				this.set("children", {
                    home: Child({name: "AChild"}),
                    away: Child({name: "BChild"})
                }).populate({ callback: function(res) {
                	expect(res.html.element.outerHTML).toBe('<table><tr><td class="c1">AChild</td><td class="c2">test</td></tr><tr><td class="c1">BChild</td><td class="c2">test</td></tr></table>');
                	done();
                }});				
			}
		})();
	});

	it("should compile tr tag", function(done) {
		absurd.component("Person", {
			name: "John",
			age: 42,
			html: {
				tr: [
					'<td class="A"><% this.name %></td>',
					'<td class="B"><% this.age %></td>',
				]
			},
			constructor: function() {
				this.populate({ callback: function(res) {
                	expect(res.html.element.outerHTML).toBe('<tr><td class="A">John</td><td class="B">42</td></tr>');
                	done();
                }});				
			}
		})();
	});
});