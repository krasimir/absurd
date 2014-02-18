describe("Testing components (apply helpers)", function() {

	it("should use applyCSS", function(done) {
		absurd.component("ApplyCSSTesting1", {
			constructor: function() {
				this.applyCSS({ 
					'.apply-css-testing': {
						fz: '20px'
					}
				});
				expect(this.css['.apply-css-testing'].fz).toBe('20px');
				done();
			}
		})();
	});

	it("should use applyCSS with HTML element", function(done) {
		absurd.component("ApplyCSSTesting2", {
			html: '#banner-A',
			constructor: function() {
				this.applyCSS({
					bg: '#F00'
				});
				var styles = this.qs('#ApplyCSSTesting2-css', document);
				expect(styles.innerHTML.replace(/\n/g, '')).toBe('#banner-A {  background: #F00;}');	
				done();
			}
		})();
	});

	it("should use applyHTML", function(done) {
		absurd.component("ApplyHTMLTesting", {
			constructor: function() {
				this.applyHTML({
					'.apply-html-testing': 'test'
				});	
				expect(this.el.outerHTML).toBe('<div class="apply-html-testing">test</div>');
				done();
			}
		})();
	});

});