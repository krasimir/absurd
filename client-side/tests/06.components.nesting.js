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
					'<td class="team"><% this.name %></td>',
					'<td class="score">V</td>'
				]
			},
			constructor: function(data) {
				this.name = data.name;
			}
		});
		absurd.component("Parent", {
			html: {
				'table.kuusi-pelia': [
					'<% this.child("home") %>',
					'<% this.child("away") %>'
				]
			},
			constructor: function() {
				this.set("children", {
                    home: Child({name: "AChild"}),
                    away: Child({name: "BChild"})
                }).populate({ callback: function(res) {
                	// console.log(res.html.element.outerHTML);
                	done();
                }});				
			}
		})();
	});

	/*
	var Last6GamesTable = absurd.component("Last6GamesTable", {
		html: {
			tr: [
				'<td class="team"><% this.name %></td>',
				'<td class="score"><span>H</span></td>',
				'<td class="score"><span>V</span></td>',
				'<td class="score"><span>V</span></td>',
				'<td class="score"><span>H</span></td>',
				'<td class="score"><span>V</span></td>',
				'<td class="score"><span>V</span></td>'
			]
		},
		constructor: function(data) {
			this.name = data.name;
		},
		populated: function(res) {
			console.log(res.html.element.outerHTML);
		}
	});
	*/

});