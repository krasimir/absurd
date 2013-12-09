describe("Testing components", function() {

	var absurd = Absurd();

	it("should have .components API available", function(done) {
		expect(absurd.components).toBeDefined();
		done();
	});

	it("should have API methods (wishlist)", function(done) {
		expect(absurd.components.register).toBeDefined();
		expect(absurd.components.get).toBeDefined();
		expect(absurd.components.remove).toBeDefined();
		expect(absurd.components.extend).toBeDefined();
		expect(absurd.components.list).toBeDefined();
		expect(absurd.components.flush).toBeDefined();
		done();
	});

	it("should register a component", function(done) {
		var widget = absurd.components.register("widget", {
			customMethod: function() {
				return "custom method";
			}
		}).on("custom-event", function(data) {
			expect(data.prop).toBe(30);
			done();
		});
		expect(widget.on).toBeDefined();
		expect(widget.off).toBeDefined();
		expect(widget.dispatch).toBeDefined();
		expect(widget.render).toBeDefined();
		expect(widget.customMethod()).toBe("custom method");
		absurd.components.get("widget").dispatch("custom-event", {prop: 30});
	});

	it("should register and remove a component", function(done) {
		absurd.components.flush();
		absurd.components.register("comp33");
		expect(absurd.components.list() instanceof Array).toBeTruthy();
		expect(absurd.components.list().length > 0).toBeTruthy();
		absurd.components.remove("comp33");
		expect(absurd.components.list().length).toBe(0);
		done();
	});

	it("should compile css and html", function(done) {
		absurd.components.register("main-menu", {
			css: {
				'.main-menu': {
					display: 'none',
					margin: 0,
					padding: '10px 0 0 10px',
					a: {
						color: '#F00',
						textTransform: 'uppercase'
					}
				}
			},
			html: {
				'ul.main-menu': [
					'<% for(var i=0; i<this.links.length, link=this.links[i]; i++) { %>',
					{ 
						li: {
							'a[href="<% link.url %>"]': '<% link.label %>'
						}
					},
					'<% } %>'
				]
			},
			links: [
				{ url: "http://google.com", label: "Google" },
				{ url: "http://yahoo.com", label: "Yahoo" }
			]
		}).on("rendered", function() {
			expect(document.getElementById("main-menu-css")).toBeDefined();
			expect(document.querySelector(".main-menu")).toBeDefined();
			expect(document.querySelector(".main-menu").parentNode.nodeName).toBe('BODY');
			done();
		}).render("body");
	});

});