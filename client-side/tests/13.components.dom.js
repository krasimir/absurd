describe("Testing components (dom)", function() {

	it("should get an access to component's element", function(done) {
		absurd.component('TestingDom', {
			html: '.form',
			constructor: function(dom) {
				expect(dom).toBeDefined();
				expect(dom().el).toBe(undefined);
				this.populate();
				expect(dom().el.nodeName.toLowerCase()).toBe('div');
				done();
			}
		})();
	});

	it("should get an access to any dom", function(done) {
		absurd.component('TestingDom', {
			constructor: function(dom) {
				expect(dom('.form textarea').el.nodeName.toLowerCase()).toBe('textarea');
				done();
			}
		})();
	});

	it("should get an access to elements in a hash format", function(done) {
		absurd.component('TestingDom', {
			constructor: function(dom) {
				var els = dom({
					textarea: '.textarea',
					controls: {
						check: '[name="check-options"]'
					}
				});	
				expect(els.textarea.el.nodeName.toLowerCase()).toBe('textarea');
				expect(els.controls.check.el.nodeName.toLowerCase()).toBe('input');
				done();
			}
		})();
	});

	it("should use `val`", function(done) {
		absurd.component('TestingDom', {
			html: '.form',
			constructor: function(dom) {
				this.populate();

				expect(dom('.input').val()).toBe('blah');
				expect(dom(this.qs('.input')).val()).toBe('blah');
				expect(dom(dom('.input').el).val()).toBe('blah');
				expect(dom('.textarea').val()).toBe('blah in textarea');
				expect(dom('.select').val()).toBe('B');
				this.qsa('[name="radio"]')[1].setAttribute('checked', 'checked');
				expect(dom('[name="radio"]').val()).toBe('blah2');
				this.qsa('[name="check-options"]')[1].setAttribute('checked', 'checked');
				expect(dom('[name="check-options"]').val().join('')).toBe('check2');
				expect(dom('.div').val()).toBe('div blah');
				expect(dom('.span').val()).toBe('I\'m an inline');
				expect(dom('.link').val()).toBe('I\'m a link');
				expect(dom('.section').val()).toBe('Title hereVery long text with link inside.');	

				expect(dom('textarea').val('new text').val()).toBe('new text');
				expect(dom('[name="radio"]').val('blah1').val()).toBe('blah1');
				expect(dom('[type="checkbox"]').val('check3').val().join('')).toBe('check3');
				expect(dom('select').val('C').val()).toBe('C');
				expect(dom('.input').val('dom').val()).toBe('dom');
				expect(dom('.div').val('new content').val()).toBe('new content');
				expect(dom('.span').val('new c').val()).toBe('new c');
				expect(dom('.link').val('click me').val()).toBe('click me');
				expect(dom('p').val('300').val()).toBe('300');
				expect(dom('section h1').val('TTT').val()).toBe('TTT');
				expect(dom('section p').val('<b>bold</b> text with <a href="#">a link</a>').val()).toBe('bold text with a link');
				expect(dom('ul li:first-child').val('---').val()).toBe('---');

				done();
			}
		})();
	});

	it("should keep the scope", function(done) {
		absurd.component('TestingDom', {
			constructor: function(dom) {			
				expect(dom('p').val()).toBe('Nothing');
				expect(dom('p', '.form').val()).toBe('300');
				expect(dom('p', '.form .section').val()).toBe('bold text with a link');
				expect(dom('p', this.qs('.form')).val()).toBe('300');
				done();
			}
		})();
	});

	it("should use `val` with hash", function(done) {
		absurd.component('TestingDom', {
			constructor: function(dom) {
				var values = dom({
					text: '.textarea',
					options: {
						r: '[name="radio"]',
						c: '[name="check-options"]'
					}
				}, '.form').val();
				expect(JSON.stringify(values)).toBe('{"text":"new text","options":{"r":"blah1","c":["check3"]}}');
				done();
			}
		})();
	});

	it("should chain dom method", function(done) {
		absurd.component('TestingDom', {
			constructor: function(dom) {
				expect(dom('.form').dom('[href="#"]').val()).toBe('click me');
				expect(dom('.form').dom('.section').dom('[href="#"]').val()).toBe('a link');
				done();
			}
		})();
	});	

	it("should work with radio and checkboxes", function(done) {
		absurd.component('TestingDOM', {
			html: '.dom-test',
		    constructor: function(dom) {
		    	this.populate();
		        expect(dom('[type="radio"]').val()).toBe('oB');
		        expect(dom('[type="checkbox"]').val().join(',')).toBe('f2,f3');
		        done();
		    }
		})();
	});

});