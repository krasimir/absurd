describe("Testing components (HTML compilation)", function() {

	it("should initialize component with already added dom element", function(done) {
		absurd.components.flush().register("banner-A", {
			html: "#banner-A",
			text: "awesome",
			theme: "black",
			populated: function(data) {
				expect(document.querySelector("#banner-A p").innerHTML).toBe(this.text);
				expect(document.querySelector("#banner-A").getAttribute("class")).toBe(this.theme);
				done();
			}
		})().populate();
	});

	it("should add the html element to the DOM", function(done) {
		absurd.components.flush().register("class-D", {
			css: {
				'.class-D': { display: 'none' }
			},
			html: {
				'.class-D': {
					h1: 'Class D',
					'p#classd': 'a dome element'
				}
			},
			populated: function(data) {
				expect(document.getElementById("classd") !== null).toBe(true);
				done();
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should compile html", function(done) {
		absurd.components.flush().register("class-B", {
			html: {
				'ul.class-B': [
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
		})().on("populated", function(data) {
			expect(data.html.element.outerHTML).toBe('<ul class="class-B"><li><a href="http://google.com">Google</a></li><li><a href="http://yahoo.com">Yahoo</a></li></ul>');
			done();
		}).populate();
	});

	it("should change attributes", function(done) {
		absurd.components.flush().register("class-C", {
			html: {
				'section[class="grid" id="grid"]': {
					'p[data-event="click"]': "test"
				}
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					expect(
						data.html.element.outerHTML === '<section class="grid" id="grid"><p data-event="click">test</p></section>' ||
						data.html.element.outerHTML === '<section id="grid" class="grid"><p data-event="click">test</p></section>'
					).toBe(true);
					this.html = {
						'section[class="grid4" id="grid" data-monitor="300"]': {
							'p[data-pass="click" class="blue"]': "test"
						}
					}
					this.populate();
				} else {
					expect(
						data.html.element.outerHTML === '<section class="grid4" id="grid" data-monitor="300"><p data-pass="click" class="blue">test</p></section>' || 
						data.html.element.outerHTML === '<section id="grid" class="grid4" data-monitor="300"><p class="blue" data-pass="click">test</p></section>' ||
						data.html.element.outerHTML === '<section data-monitor="300" class="grid4" id="grid"><p data-pass="click" class="blue">test</p></section>' ||
						data.html.element.outerHTML === '<section id="grid" data-monitor="300" class="grid4"><p data-pass="click" class="blue">test</p></section>').toBe(true);
					done();
				}
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should change the whole node", function(done) {
		absurd.components.flush().register("class-D", {
			css: {
				'#grid': { display: 'none' }
			},
			html: {
				'section[class="grid" id="grid"]': {
					'p[data-event="click"]': "test"
				}
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					expect(
						data.html.element.outerHTML === '<section class="grid" id="grid"><p data-event="click">test</p></section>' ||
						data.html.element.outerHTML === '<section id="grid" class="grid"><p data-event="click">test</p></section>'
					).toBe(true);
					this.html = {
						'section[class="grid" id="grid"]': {
							'div[data-event="click"]': "test"
						}
					}
					this.populate();
				} else {
					expect(
						data.html.element.outerHTML === '<section class="grid" id="grid"><div data-event="click">test</div></section>' ||
						data.html.element.outerHTML === '<section id="grid" class="grid"><div data-event="click">test</div></section>').toBe(true);
					done();
				}
			}
		})().populate();
	});

	it("should add the html element to the DOM with delay", function(done) {
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
				if(typeof this.tested === 'undefined') {
					this.tested = 0;
				}
				if(this.tested < 10) {
					this.tested++;
					this.html['.class-D2']['h1#class-d2-title'] = "Title " + this.tested;
					if(this.tested == 5) {
						this.set("parent", document.querySelector("#content"));
					}
					this.populate();
				} else {
					expect(document.getElementById('class-d2-title').innerHTML).toBe("Title 10");
					done();
				}
			}
		})().populate()
	});

	it("the for loop with < should work if it is defined in js", function(done) {
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
				expect(data.html.element.outerHTML).toBe("<section><span>A</span><span>B</span><span>C</span></section>");
				done();
			}
		})().populate();
	});

	it("should compile with empty data", function(done) {
		absurd.components.register("EmptyData", {
			title: '',
			html: {
				section: {
					p: '<% this.title %>'
				}
			},
			populated: function(data) {				
				if(!this.tested) {
					this.tested = true;
					this.title = '42';
					this.populate();
				} else {
					expect(data.html.element.outerHTML).toBe('<section><p>42</p></section>');
					done();
				}
			}
		})().populate();
	});

	it("should remove dom elements", function(done) {
		absurd.components.register("RemoveDomElements", {
			links: [
				{ label: "A" },
				{ label: "B" },
				{ label: "C" }
			],
			html: {
				nav: [
					'<% for(var i=0; i<this.links.length; i++) { %>',
					'<a href="#"><% this.links[i].label %></a>',
					'<% } %>'
				]
			},
			populated: function(data) {				
				if(!this.tested) {
					this.tested = true;
					this.links = [
						{ label: "A" },
						{ label: "C" }
					]
					this.populate();
				} else {
					expect(this.el.outerHTML).toBe('<nav><a href="#">A</a><a href="#">C</a></nav>');
					done();
				}
			}
		})().populate();
	});


	it("should compile with a function", function(done) {
		absurd.components.register("FunctionData", {
			title: '',
			html: {
				section: {
					p: function() {
						return "the answer is 42";
					}
				}
			},
			populated: function(data) {
				expect(data.html.element.outerHTML).toBe('<section><p>the answer is 42</p></section>');
				done();
			}
		})().populate();
	});

	it("should change the html dynamically", function(done) {
		absurd.components.register("FunctionData", {
			title: '',
			html: {
				section: {
					h1: 'Test',
					'.marker': { span: '' }
				}
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					this.html.section['.marker'] = { 'a[href="#"]': 'test link' };
					this.populate();
				} else {
					expect(data.html.element.outerHTML).toBe('<section><h1>Test</h1><div class="marker"><a href="#">test link</a></div></section>');
					done();	
				}				
			}
		})().populate();
	});

	it("should change the html dynamically of two components", function(done) {
		var C = absurd.components.register("FunctionData", {
			title: '',
			html: {
				section: {
					h1: 'Test',
					'.marker': { span: '' }
				}
			},
			constructor: function(change) {
				this.change = change;
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					if(this.change) {
						this.html.section['.marker'] = { 'a[href="#"]': 'test link' };
					}
					this.populate();
				} else {
					result(data, this.change);
				}				
			}
		});
		var i = 0;
		var result = function(data, change) {
			if(change) {
				expect(data.html.element.outerHTML).toBe('<section><h1>Test</h1><div class="marker"><a href="#">test link</a></div></section>');
			} else {
				expect(data.html.element.outerHTML).toBe('<section><h1>Test</h1><div class="marker"><span></span></div></section>');
			}
			i += 1;
			if(i == 2) {
				done();
			}
			done();
		}
		C(true).populate();
		C().populate();
	});

	it("should not throw an error if the element is not found", function(done) {
		absurd.components.register("FunctionData", {
			html: "#missing-element-42",
			populated: function() {
				expect(this.el).toBe(null);
				done();
			}
		})().populate();
	});

	it("should prevent html compilation from within the populate method", function(done) {
		absurd.components.flush().register("class-CC2014--2", {
			html: {
				p: {
					span: 'Hello world'
				}
			},
			populated: function(data) {
				expect(this.el).toBe(undefined);
				done();
			}
		})().populate({ html: false });
	});


});