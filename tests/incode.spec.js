describe("Absurd acting in code", function() {

	var Absurd, absd;

	it("shoud create an instance of absurd", function(done) {
		Absurd = require("../index.js");
		expect(Absurd).toBeDefined();
		done();
	});

	it("should initialize absurd", function(done) {
		absd = Absurd("./data/css/index.js");
		expect(typeof absd).toBe("object");
		done();
	});

	it("should work with different path passing", function(done) {
		var path = '';

		absd = Absurd();
		paths = absd.getPaths();
		expect(paths.length).toBe(0);

		absd = Absurd("./data/css/index.js");
		paths = absd.getPaths();
		expect(paths.length).toBe(1);
		expect(paths[0].path).toBe("./data/css/index.js");

		absd = Absurd(["./data/css/index.js"]);
		paths = absd.getPaths();
		expect(paths.length).toBe(1);
		expect(paths[0].path).toBe("./data/css/index.js");

		absd = Absurd(["./data/css/index.js", "./data/css/styles.js"]);
		paths = absd.getPaths();
		expect(paths.length).toBe(2);
		expect(paths[0].path).toBe("./data/css/index.js");
		expect(paths[1].path).toBe("./data/css/styles.js");

		absd = Absurd({path: "./data/css/index.js"});
		paths = absd.getPaths();
		expect(paths.length).toBe(1);
		expect(paths[0].path).toBe("./data/css/index.js");

		absd = Absurd([
			{path: "./data/css/index.js"}, 
			{path: "./data/css/styles.js"}
		]);
		paths = absd.getPaths();
		expect(paths.length).toBe(2);
		expect(paths[0].path).toBe("./data/css/index.js");
		expect(paths[1].path).toBe("./data/css/styles.js");

		done();
	});
	
});