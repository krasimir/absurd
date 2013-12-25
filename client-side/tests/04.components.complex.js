describe("Testing components in complex scenarios", function() {

	it("should be able to update css and html", function(done) {
		absurd.components.register("blog-articles", {
			css: {
				'.blog-articles': {
					display: 'none',
					color: '#F00'
				}
			},
			html: {
				'.blog-articles': {
					p: '<% this.text %>'
				}
			},
			text: "My articles.",
			populated: function() {
				var self = this;
				if(!this.tested) {
					this.tested = true;
					self.css['.blog-articles'].color = '#00F';
					self.text = "New text.";
					self.populate({bla: 2, callback: function(data) {
						expect(document.querySelectorAll("#blog-articles-css").length).toBe(1);
						expect(document.querySelectorAll(".blog-articles").length).toBe(1);
						expect(document.querySelector(".blog-articles p").outerHTML).toBe('<p>New text.</p>');
						done();
					}});
				}
			}
		})().set("parent", document.querySelector("body")).populate();
	});

});