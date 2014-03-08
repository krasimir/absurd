describe("Final tests", function() {
	
	it("should use the body as html", function(done) {
		absurd.components.register("BodyBugTest", {
			html: "body",
			populated: function() {
				expect(this.el.nodeName.toLowerCase()).toBe('body');
				done();
			}
		})().populate();
	});

});