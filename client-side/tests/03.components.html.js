describe("Testing components (HTML compilation)", function() {

	xit("should initialize component with already added dom element", function(done) {
		absurd.components.flush().register("banner-A", {
			html: "#banner-A",
			text: "awesome",
			populated: function(data) {
				console.log(data);
				done();
			}
		}).populate();
	});

	xit("should compile html", function(done) {
		absurd.components.flush().register("class-C", {
			html: {
				'ul.class-C': [
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
		}).on("populated", function(data) {
			expect(data.html.raw).toBe('<ul class="class-C"><li><a href="http://google.com">Google</a></li><li><a href="http://yahoo.com">Yahoo</a></li></ul>');
			done();
		}).populate();
	});

	xit("should add the html element to the DOM", function(done) {
		absurd.components.flush().register("class-D", {
			css: {
				'.class-D': { display: 'none' }
			},
			html: {
				'.class-D': {
					h1: 'Class D',
					'p#classd': 'test'
				}
			},
			populated: function(data) {
				expect(document.getElementById("classd")).toBeDefined();
				done();
			}
		}).set("parent", "body").populate()
	});

	xit("should add the html element to the DOM with delay", function(done) {
		absurd.components.flush().register("class-D2", {
			css: {
				'.class-D2': { display: 'none' }
			},
			html: {
				'.class-D2': {
					'h1#class-d2-title': 'Title 0'
				}
			},
			populated: function(data) {
				var self = this;
				if(!this.tested) {
					this.tested = 0;
				}
				if(this.tested < 10) {
					this.tested++;
					this.html['.class-D2']['h1#class-d2-title'] = "Title " + this.tested;
					if(this.tested == 5) {
						this.set("parent", "body");
					}
					setTimeout(function() {
						self.populate();
					}, 10);
				} else {
					expect(document.getElementById('class-d2-title').innerHTML).toBe("Title 10");
					done();
				}
			}
		}).populate()
	});

	xit("should create a component based on already added DOM element", function(done) {
		var alreadyDefined = absurd.components.flush().register("already", {
			html: "#already-defined-A",
			populated: function(data) {
				expect(document.getElementById('already-defined-A')).toBe(data.html.element);
				done();
			}
		}).populate();
	});

	xit("should update already defined DOM element", function(done) {
		var alreadyDefined = absurd.components.flush().register("already", {
			html: "#already-defined-B",
			fieldValue: "sample text",
			list: ["A", "B", "C"],
			populated: function(data) {
				expect(document.getElementById('already-defined-B')).toBe(data.html.element);
				if(document.querySelector('#already-defined-B') != null) {
					expect(document.querySelector('#already-defined-B > input').value).toBe(this.fieldValue);
					expect(document.querySelectorAll('.already-defined-B-p').length).toBe(this.list.length);
				}
				done();
			}
		}).populate();
	});

	xit("the for loop with < should work if it is defined in js", function(done) {
		absurd.components.register("for-loop-test", {
			html: {
				section: [
					'<% for(var i=0; i<this.list.length; i++) { var item=this.list[i]; %>',
					{ span: '<% item %>' },
					'<% } %>'
				]
			},
			list: ['A', 'B', 'C'],
			populated: function(data) {
				expect(data.html.raw).toBe("<section><span>A</span><span>B</span><span>C</span></section>");
				done();
			}
		}).populate();
	});

});