describe("Appending styles - ", function() {

	var Absurd = require('../../index.js');

	it("should append a style", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "0px 0px 3px red",
			        "color": "green"
			    },
			});
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 7px blue"
			    },
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red,0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should allow plus sign in the first selector", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red,0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should allow plus sign in the first selector only", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": "0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should append with an interval", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": ">0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": ">0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red 0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

});