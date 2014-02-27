describe("Testing components (utils)", function() {

	it("should use qs and qsa", function(done) {
		absurd.component("QSTests", {
			data: ['A', 'B', 'C'],
			html: {
				div: {
					'ul#menu': [
						'<% for(var i=0; i<this.data.length; i++) { %>',
						{ li: '<% this.data[i] %>' },
						'<% } %>'
					]
				}
			},
			constructor: function() {				
				expect(this.populate().el.outerHTML).toBe('<div><ul id="menu"><li>A</li><li>B</li><li>C</li></ul></div>');
				expect(this.qs('#menu').nodeName.toLowerCase()).toBe('ul');
				expect(this.qsa('li', this.qs('#menu')).length).toBe(3);
				expect(this.qs('body', document)).toBeDefined();
				done();
			}
		})();
	});

	it("should use getStyle", function(done) {
		absurd.component("GetStyleTest", {
			css: {
				'#get-style-test': {
					color: '#F00',
					width: '300px',
					display: 'none'
				}
			},
			html: {
				'#get-style-test': 'The answer is 42'
			},
			constructor: function() {				
				this.set("parent", this.qs("body")).populate();
				expect(this.getStyle('width')).toBe('300px');
				expect(this.getStyle('display')).toBe('none');
				done();
			}
		})();
	});

	it("should manage classes", function(done) {
		absurd.component("GetStyleTest", {			
			css: {
				'.content-manage-class-test': {
					display: 'none'
				}
			},
			html: {
				'.content-manage-class-test': {
					p: {
						a: 'link'
					}
				}
			},
			constructor: function() {				
				this.set("parent", this.qs("body")).populate();
				this.addClass('testA', this.qs('p'));
				expect(this.el.outerHTML).toBe('<div class="content-manage-class-test"><p class="testA"><a>link</a></p></div>');
				this.addClass('testA', this.qs('p'));
				expect(this.el.outerHTML).toBe('<div class="content-manage-class-test"><p class="testA"><a>link</a></p></div>');
				this.addClass('testB', this.qs('p'));
				this.addClass('testC', this.qs('p'));
				this.addClass('testD', this.qs('p'));
				this.removeClass('testC', this.qs('p'));
				expect(this.el.outerHTML).toBe('<div class="content-manage-class-test"><p class="testA testB testD"><a>link</a></p></div>');
				this.replaceClass('testB', 'testE', this.qs('p'));
				expect(this.el.outerHTML).toBe('<div class="content-manage-class-test"><p class="testA testE testD"><a>link</a></p></div>');
				done();
			}
		})();
	});

});