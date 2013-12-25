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

});