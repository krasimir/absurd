describe("Common", function() {

	it("should have Absurd available", function(done) {
		expect(Absurd).toBeDefined();
		done(); 
	});

	it("should compile", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
					marginTop: "20px",
					p: {
						fontSize: "12px"
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBe('body {\n  margin-top: 20px;\n}\nbody p {\n  font-size: 12px;\n}\n');
			done();
		})
	});

});