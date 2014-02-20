describe("Testing components (async)", function() {

	it("should use async", function(done) {
		absurd.components.flush().register("Async test", {
			html: {
				'.content': {
					h1: '<% this.async("getTitle", "parameter", 42) %>',
					span: '<% this.getSubTitle() %>'
				}
			},
			getTitle: function(callback, a, b) {
				expect(a).toBe("parameter");
				expect(b).toBe(42);
				callback("My Title");
			},
			getSubTitle: function() {
				return 'subtitle';
			},
			populated: function(data) {
				expect(data.html.element.outerHTML).toBe('<div class="content"><h1>My Title</h1><span>subtitle</span></div>');
				done();
			}
		})().populate();
	});

	it("should use async in a loop", function(done) {
		absurd.components.flush().register("Async test 2", {
			html: {
				'.content': {
					ul: [
						'<% for(var i=0; i<this.data.length; i++) { %>',
						{ li: '<% this.async("getText", i) %>' },
						'<% } %>'
					]
				}
			},
			getText: function(callback, index) {
				setTimeout(function() {
					callback("item " + (index+1));
				}, 10);				
			},
			data: [1, 1, 1, 1, 1],
			populated: function(data) {
				expect(data.html.element.outerHTML).toBe('<div class="content"><ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li><li>item 5</li></ul></div>');
				done();
			}
		})().populate();
	});

	it("should use several same async function but several times", function(done) {
		absurd.components.flush().register("Async test 3", {
			html: {
				'.content': [
					{ p: '<% this.async("getValue", this.data[0]) %>' }, 
					{ p: '<% this.async("getValue", this.data[1]) %>' },
					{ p: '<% this.async("getValue", this.data[2]) %>' }
				]
			},
			getValue: function(callback, value) {
				setTimeout(function() {
					callback("v: " + value);
				}, 10);				
			},
			data: [10, 20, 30],
			populated: function(data) {
				expect(data.html.element.outerHTML).toBe('<div class="content"><p>v: 10</p><p>v: 20</p><p>v: 30</p></div>');
				done();
			}
		})().populate();
	});

	it("should wait till the populate execution ends", function(done) {
		absurd.components.flush().register("Async test 4", {
			html: {
				'.content': [
					{ p: '<% this.async("getValue", this.data[0]) %>' }, 
					{ p: '<% this.async("getValue", this.data[1]) %>' },
					{ p: '<% this.async("getValue", this.data[2]) %>' }
				]
			},
			getValue: function(callback, value) {
				setTimeout(function() {
					callback("v: " + value);
				}, 100);				
			},
			data: ['a', 'b', 'c'],
			populated: function(data) {
				expect(data.html.element.outerHTML).toBe('<div class="content"><p>v: a</p><p>v: b</p><p>v: c</p></div>');
				done();
			}
		})().populate().populate();
	});

});