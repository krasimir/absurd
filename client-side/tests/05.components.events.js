describe("Testing components events", function() {

	var absurd = Absurd();

	xit("should register events", function(done) {
		absurd.components.register("TestingEvents", {
			title: '',
			html: {
				form: {
					p: '<% this.title %>',
					'input[type="text" data-absurd-event="change:handler"]': ''
				}
			},
			handler: function(e) {
				console.log("change");
				this.title = e.target.value;
				this.populate();
			},
			populated: function(data) {
				if(!this.tested) {
					var input = data.html.element.querySelector("input");
					input.value = "42";
					this.tested = true;
					fireEvent(input, "change");	
				} else {
					console.log("end");
				}				
			}
		}).set("parent", document.querySelector("body")).populate();
	});

});