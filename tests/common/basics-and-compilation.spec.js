describe("Absurd acting in code:", function() {

	var Absurd, absurd;
	Absurd = require("../../index.js");

	xit("shoud create an instance of absurd", function(done) {
		expect(Absurd).toBeDefined();
		done();
	});

	xit("should initialize absurd", function(done) {
		absurd = Absurd(__dirname + "/../data/css/index.js");
		expect(typeof absurd).toBe("object");
		done();
	});

	xit("should work with no path passed", function(done) {
		absurd = Absurd();
		absurd.add({a: {color: "#123"}});
		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain("color: #123;");
			done();
		})
	});

	xit("should compile an inline function", function(done) {
		Absurd(function(api) {
			api.add({
				'.absurd-title': {
					'border-radius': '10px'
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain(".absurd-title");
			expect(css).toContain("border-radius: 10px");
			done();
		});		
	});

	xit("should compile a file", function(done) {
		absurd = Absurd(__dirname + "/../data/css/index.js");
		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			done();
		});		
	});

	it("should compile styles passed in array", function(done) {
		Absurd(function(api) {
			api.add({
				'.header nav': [
					{ 'font-size': '10px' },
					{ 'font-size': '20px' }
				]
			})
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain(".header nav {\n  font-size: 20px;");
			done();
		})
	});

	
});