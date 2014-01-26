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

});