describe("Testing components in complex scenarios", function() {

	xit("should be able to update css and html", function(done) {
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
					setTimeout(function() {
						self.css['.blog-articles'].color = '#00F';
						self.text = "New text.";
						self.populate({bla: 2, callback: function(data) {
							expect(document.querySelectorAll("#blog-articles-css").length).toBe(1);
							expect(document.querySelectorAll(".blog-articles").length).toBe(1);
							expect(document.querySelectorAll(".blog-articles")[0].innerHTML).toBe('<p>New text.</p>');
							done();
						}});						
					}, 100);
				}
			}
		}).set("parent", "body").populate();
	});

	xit("should work with already added DOM element", function(done) {
		absurd.components.register("piece", {
			html: "#my-awesome-element",
			title: "Hello world",
			text: "More text ...",
			myClickHandler: function() {
				done();
			},
			populated: function() {
				var self = this;
				if(!this.tested) {
					this.tested = true;
					setTimeout(function() {
						self.title = "It works :)";
						self.text = "Come on ..."
						self.populate();
						var p = document.querySelector("#my-awesome-element section p");
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent("click", true, true); 
						p.dispatchEvent(evt);
					}, 100);
				}
			}
		}).populate();
	});

});