describe("Testing components", function() {

	var absurd = Absurd();

	it("should have .components API available", function(done) {
		expect(absurd.components).toBeDefined();
		done();
	});

	xit("should have API methods (wishlist)", function(done) {
		expect(absurd.components.register).toBeDefined();
		expect(absurd.components.get).toBeDefined();
		expect(absurd.components.remove).toBeDefined();
		expect(absurd.components.extend).toBeDefined();
		expect(absurd.components.list).toBeDefined();
		expect(absurd.components.flush).toBeDefined();
		expect(absurd.components.broadcast).toBeDefined();
		done();
	});

	xit("should register a component", function(done) {
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
		expect(widget.populate).toBeDefined();
		expect(widget.customMethod()).toBe("custom method");
		absurd.components.get("widget").dispatch("custom-event", {prop: 30});
	});

	xit("should register and remove a component", function(done) {
		absurd.components.flush();
		absurd.components.register("comp33");
		expect(absurd.components.list() instanceof Array).toBeTruthy();
		expect(absurd.components.list().length > 0).toBeTruthy();
		absurd.components.remove("comp33");
		expect(absurd.components.list().length).toBe(0);
		done();
	});

	xit("should compile css and html", function(done) {
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
		}).on("populated", function() {
			expect(document.getElementById("main-menu-css")).toBeDefined();
			expect(document.querySelector(".main-menu")).toBeDefined();
			expect(document.querySelector(".main-menu").parentNode.nodeName).toBe('BODY');
			done();
		}).populate({appendTo: "body"});
	});

	xit("should register two components and broadcast a message", function(done) {
		var c =0, count = function() {
			c += 1;
			if(c == 2) done();
		}
		absurd.components.flush();
		absurd.components.register("c1", { omg: function() { count(); } });
		absurd.components.register("c2", { omg: function() { count(); } });
		absurd.components.broadcast("omg");
	});

	xit(".populate method should return the html", function(done) {
		absurd.components.flush().register("c", {
			html: {
				section: {
					h1: "Title",
					p: "Text"
				}
			},
			populated: function(data) {
				expect(data.html).toBeDefined();
				expect(data.html).toBe("<section><h1>Title</h1><p>Text</p></section>");
				done();
			}
		}).populate();
	});

});