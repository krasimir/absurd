describe("Absurd acting in code:", function() {

	var Absurd, absurd;

	it("shoud create an instance of absurd", function(done) {
		Absurd = require("../index.js");
		expect(Absurd).toBeDefined();
		done();
	});

	it("should initialize absurd", function(done) {
		absurd = Absurd("./data/css/index.js");
		expect(typeof absurd).toBe("object");
		done();
	});

	it("should work with different path passing", function(done) {
		var path = '';

		absurd = Absurd("./data/css/index.js");
		path = absurd.getPath();
		expect(path.source).toBeDefined();
		expect(path.source).toBe("./data/css/index.js");

		absurd = Absurd({source: "./data/css/index.js"});
		path = absurd.getPath();
		expect(path.source).toBeDefined();
		expect(path.source).toBe("./data/css/index.js");

		absurd = Absurd();
		path = absurd.getPath();
		expect(path.source).not.toBeDefined();
		expect(path.err).toBeDefined();

		done();
	});

	it("should compile an inline function", function(done) {
		Absurd(function() {
			this.add({
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

	it("should compile a file", function(done) {
		absurd = Absurd(__dirname + "/data/css/index.js");
		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			done();
		});		
	});

	
});