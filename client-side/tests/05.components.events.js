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
					var input = this.el.querySelector("input");
					input.value = "42";
					this.tested = true;
					fireEvent(input, "keyup");
				} else {
					expect(this.el.querySelector("p").innerHTML).toBe("42");
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

	it("should register events and pass parameter", function(done) {
		absurd.components.register("TestingEvents", {
			css: {
				'#testing-events-form2': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form2': {
					'input[type="text" data-absurd-event="keyup:handler:300:400"]': ''
				}
			},
			handler: function(e, a, b) {
				expect(parseInt(a)).toBe(300);
				expect(parseInt(b)).toBe(400);
				done();
			},
			populated: function(data) {
				var input = this.el.querySelector("input");
				input.value = "42";
				fireEvent(input, "keyup");				
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should call click event twice", function(done) {
		absurd.components.register("TestingEvents", {
			css: {
				'#testing-events-form3': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form3': {
					'input[type="button" data-absurd-event="click:handler"]': ''
				}
			},
			handler: function(e) {
				if(!this.tested) {
					this.tested = 1;
					fireEvent(this.input, "click");
					done();
				}				
			},
			populated: function(data) {
				this.input = this.el.querySelector("input");
				this.input.value = "42";
				fireEvent(this.input, "click");				
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should broadcast a ready message", function(done) {
		expect(isDomReady).toBe(true);
		done();
	});

	it("should listen for onAnimationEnd", function(done) {
		absurd.components.flush();
		absurd.component('AnimationAndEnd', {
			html: {
				'div.animTest': '&nbsp;'
			},
			css: {
				'.animTest': {
					animate: 'bounce',
					'-wmso-animation-duration': '200ms'
				}
			},
			populated: function() {
				this.onAnimationEnd(this.el, function(e) {
					expect(this.__name).toBe('AnimationAndEnd');
					expect(e).toBeDefined();
					done();
				});
			}
		})().set('parent', document.querySelector('body')).populate();
	});

	it("should listen for onTransitionEnd", function(done) {
		absurd.components.flush();
		absurd.component('TransitionEnd', {
			html: {
				'div.animTestTransit': '&nbsp;'
			},
			css: {
				'.animTestTransit': {
					fz: '18px',
					'-wmso-transition': 'all 100ms'
				},
				'.animTestTransit-animated': {
					fz: '36px'
				}
			},
			populated: function() {
				var self = this;
				this.onTransitionEnd(function(e) {
					expect(this.__name).toBe('TransitionEnd');
					expect(e).toBeDefined();
					done();
				});
				setTimeout(function() {
					self.addClass('animTestTransit-animated', self.el);
				}, 100);
			}
		})().set('parent', document.querySelector('body')).populate();
	});

	it("should use events in a template loop", function(done) {
		absurd.components.flush();
		absurd.component('TestingEvents', {
			html: {
				'.content-events': [
					'<% for(var i=0; i<this.data.length; i++) { %>',
					'<div class="text" data-absurd-event="click:remove:<% i %>">label <% this.data[i] %></div>',
					'<% } %>'
				]
			},
			data: [1, 2, 3],
			remove: function(e, index) {
				expect(parseInt(index)).toBe(2);
				done();
			},
			constructor: function() {
				this.populate();
				fireEvent(this.qsa(".text")[2], "click");
			}
		})();
	});

	it("should use events in a template loop with HTML markup", function(done) {
		absurd.components.flush();
		absurd.component('TestingEvents', {
			html: '.content-events',
			data: [1, 2, 3],
			remove: function(e, index) {
				expect(parseInt(index)).toBe(2);
				done();
			},
			constructor: function() {
				this.populate();
				fireEvent(this.qsa(".text")[2], "click");
			}
		})();
	});

	it("should use bind method", function(done) {
		absurd.components.flush();
		var a = absurd.component('BindMethod2', {
			doSomething: function() {
				this.dispatch('bind-event', { data: 'Test' });
			}
		})();
		absurd.component('BindMethod1', {
			constructor: function() {
				a.on('bind-event', this.bind(this.updateHandler));
			},
			updateHandler: function(data) {
				expect(this.__name).toBe('BindMethod1');
				expect(data.data).toBe('Test');
				done();
			}
		})();
		a.doSomething();
	});

	it("should use bind method with predefined args", function(done) {
		absurd.components.flush();
		var a = absurd.component('BindMethod2', {
			doSomething: function() {
				this.dispatch('bind-event', { data: 'Test' });
			}
		})();
		absurd.component('BindMethod1', {
			constructor: function() {
				a.on('bind-event', this.bind(this.updateHandler, this, [42]));
			},
			updateHandler: function(answer, data) {
				expect(this.__name).toBe('BindMethod1');
				expect(data.data).toBe('Test');
				expect(answer).toBe(42);
				done();
			}
		})();
		a.doSomething();
	});

	it("should use bind method with predefined args without scope", function(done) {
		absurd.components.flush();
		var a = absurd.component('BindMethod2', {
			doSomething: function() {
				this.dispatch('bind-event', { data: 'Test' });
			}
		})();
		absurd.component('BindMethod1', {
			constructor: function() {
				a.on('bind-event', this.bind(this.updateHandler, [42]));
			},
			updateHandler: function(answer, data) {
				expect(this.__name).toBe('BindMethod1');
				expect(data.data).toBe('Test');
				expect(answer).toBe(42);
				done();
			}
		})();
		a.doSomething();
	});

	it("should allow two events", function(done) {
		absurd.components.register("TestingEvents", {
			css: {
				'#testing-events-form-2': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form-2': {
					'input[type="text" data-absurd-event="keyup:handlerA:10, keydown:handlerB:20"]': ''
				}
			},
			handlerA: function(e, index) {
				expect(parseInt(index)).toBe(10);
				fireEvent(this.input, "keydown");
			},
			handlerB: function(e, index) {
				expect(parseInt(index)).toBe(20);
				done();
			},
			populated: function(data) {
				this.input = this.qs("input");
				fireEvent(this.input, "keyup");		
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should use a shortcut for events", function(done) {
		absurd.components.register("TestingEvents", {
			title: '',
			css: {
				'#testing-events-form': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form': {
					'input[type="button"]': {
						$click: 'handler'
					}
				}
			},
			handler: function(e) {
				expect(this.el.innerHTML).toBe('<input type="button" data-absurd-event="click:handler">');
				done();
			},
			populated: function(data) {
				var input = this.el.querySelector("input");
				fireEvent(input, "click");
			}
		})().set("parent", document.querySelector("body")).populate();
	});

	it("should use a shortcut for events (multiple events)", function(done) {
		absurd.components.register("TestingEvents", {
			title: '',
			evented: 0,
			css: {
				'#testing-events-form': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form': {
					'input[type="button"]': {
						$click: 'handler',
						$keydown: 'handler'
					}
				}
			},
			handler: function(e) {
				this.evented += 1;
				if(this.evented === 2) {
					expect(this.el.innerHTML).toBe('<input type="button" data-absurd-event="click:handler,keydown:handler">');
					done();
				}
			},
			populated: function(data) {
				var input = this.el.querySelector("input");
				fireEvent(input, "click");
				fireEvent(input, "keydown");
			}
		})().set("parent", document.querySelector("body")).populate();
	});

});

var absurd = Absurd();
var isDomReady = false;
absurd.component('WaitingForReadyEvent', {
	ready: function() {
		isDomReady = true;
	}
})();