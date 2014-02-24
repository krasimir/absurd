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

	it("should use `val`", function(done) {
		absurd.flush().component('TestingVal', {
			html: '.form',
			constructor: function() {
				this.populate();
				expect(this.val('.input')).toBe('blah');
				expect(this.val(this.qs('.input'))).toBe('blah');
				expect(this.val('.textarea')).toBe('blah in textarea');
				expect(this.val('.select')).toBe('B');
				this.qsa('[name="radio"]')[1].setAttribute('checked', 'checked');
				expect(this.val('[name="radio"]')).toBe('blah2');
				this.qsa('[name="check-options"]')[1].setAttribute('checked', 'checked');
				expect(this.val('[name="check-options"]')).toBe('check2');
				expect(this.val('.div')).toBe('div blah');
				expect(this.val('.span')).toBe('I\'m an inline');
				expect(this.val('.link')).toBe('I\'m a link');
				expect(this.val('.section')).toBe('Title hereVery long text with link inside.');
				done();
			}
		})();
	});

	it("should use `val` with dom element", function(done) {
		absurd.flush().component('TestingVal', {
			html: '.form',
			constructor: function() {
				this.populate();
				expect(this.val(this.qs('.div'))).toBe('div blah');
				done();
			}
		})();
	});

	it("should use `val` with parent", function(done) {
		absurd.flush().component('TestingVal', {
			html: '.form',
			constructor: function() {
				this.populate();
				expect(this.val('p', this.qs('.section'))).toBe('Very long text with link inside.');
				done();
			}
		})();
	});

	it("should use `val` with hash", function(done) {
		absurd.flush().component('TestingVal2', {
			html: '.form',
			constructor: function() {
				this.populate();
				var values = this.val({
					textarea: '.textarea',
					check: '[name="check-options"]',
					select: '.select',
					input: '.input',
					div: '.div',
					span: '.span',
					more: {
						section: '.section',
						andmore: {
							title: '.section h1'
						}
					}
				})
				expect(JSON.stringify(values)).toBe('{"textarea":"blah in textarea","check":"check2","select":"B","input":"blah","div":"div blah","span":"I\'m an inline","more":{"section":"Title hereVery long text with link inside.","andmore":{"title":"Title here"}}}');
				done();
			}
		})();
	});

});