describe("Testing components events", function() {

	var absurd = Absurd();

	it("should register events", function(done) {
		absurd.components.register("TestingEvents", {
			title: '',
			css: {
				'#testing-events-form': {
					display: 'none'
				}
			},
			html: {
				'form#testing-events-form': {
					p: '<% this.title %>',
					'input[type="text" data-absurd-event="keyup:handler"]': ''
				}
			},
			handler: function(e) {
				this.title = e.target.value;
				this.populate();
			},
			populated: function(data) {
				if(!this.tested) {
					var input = data.html.element.querySelector("input");
					input.value = "42";
					this.tested = true;
					fireEvent(input, "keyup");	
				} else {
					expect(data.html.element.querySelector("p").innerHTML).toBe("42");
					done();
				}				
			}
		}).set("parent", document.querySelector("body")).populate();
	});

});