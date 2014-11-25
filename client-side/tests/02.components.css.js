describe("Testing components (CSS compilation)", function() {

	it("should compile css", function(done) {
		absurd.components.flush().register("class-A", {
			css: {
				'.class-A': {
					margin: 0,
					padding: 0
				}
			},
			populated: function(data) {
				var styleTag = document.getElementById("class-A-css");
				expect(styleTag).toBeDefined();
				expect(styleTag.innerHTML).toBe(data.css.raw);
				done();
			}
		})().populate();
	});

	it("should compile css after a change", function(done) {
		absurd.components.flush().register("class-B", {
			css: {
				'.class-B': {
					margin: 0,
					padding: 0
				}
			},
			populated: function(data) {
				if(!this.tested) {
					this.tested = true;
					var styleTag = document.getElementById("class-B-css");
					expect(styleTag).toBeDefined();
					expect(styleTag.innerHTML).toBe(data.css.raw);
					this.css['.class-B']['fontSize'] = "20px";
					this.populate();
				} else {
					expect(data.css.raw.indexOf('font-size: 20px') > 0).toBeTruthy();
					done();
				}
			}
		})().populate();
	});

	it("should compile css containing dynamic parts", function(done) {
		absurd.components.flush().register("class-CC2014", {
			css: {
				'<% cssClass %>': {
					margin: '0 0 0 <% mar %>',
					padding: 0
				}
			},
			cssClass: '.class-CC2014-el',
			mar: '20px',
			populated: function(data) {
				var styleTag = document.getElementById("class-CC2014-css");
				expect(styleTag).toBeDefined();
				expect(styleTag.innerHTML).toBe('.class-CC2014-el {  margin: 0 0 0 20px;  padding: 0;}');
				done();
			}
		})().populate();
	});

	it("should prevent css compilation from within the populate method", function(done) {
		absurd.components.flush().register("class-CC2014--2", {
			css: {
				'<% cssClass %>': {
					margin: '0 0 0 <% mar %>',
					padding: 0
				}
			},
			cssClass: '.class-CC2014-el',
			mar: '20px',
			populated: function(data) {
				var styleTag = document.getElementById("class-CC2014--2-css");
				expect(styleTag).toBe(null);
				done();
			}
		})().populate({ css: false });
	});

});