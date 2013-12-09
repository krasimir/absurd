describe("Testing components in complex scenarios", function() {

	var absurd = Absurd();

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
			rendered: function() {
				var self = this;
				if(!this.tested) {
					this.tested = true;
					setTimeout(function() {
						self.css['.blog-articles'].color = '#00F';
						self.text = "New text.";
						self.render();
						expect(document.querySelectorAll("#blog-articles-css").length).toBe(1);
						expect(document.querySelectorAll(".blog-articles").length).toBe(1);
						expect(document.querySelectorAll(".blog-articles")[0].innerHTML).toBe('<p>New text.</p>');
						done();
					}, 100);
				}
			}
		}).render("body");
	});

	it("should work with already added DOM element", function(done) {
		absurd.components.register("piece", {
			html: "#my-awesome-element",
			title: "Hello world",
			text: "More text ...",
			myClickHandler: function() {
				done();
			},
			rendered: function() {
				var self = this;
				if(!this.tested) {
					this.tested = true;
					setTimeout(function() {
						self.title = "It works :)";
						self.text = "Come on ..."
						self.render();
						var p = document.querySelector("#my-awesome-element section p");
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent("click", true, true); 
						p.dispatchEvent(evt);
					}, 100);
				}
			}
		}).render();
	});

});