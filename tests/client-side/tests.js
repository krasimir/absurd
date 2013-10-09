test("General", function() {
	ok(Absurd, "Absurd is defined");
	equal(typeof Absurd, "function", "Absurd should be an object");
});

asyncTest("Getting an access to the API", function() {
	var a = Absurd(function(api) {
		ok(api, "API is defined");
		ok(api.add && typeof api.add === "function", "API has an add method");
		start();
	});
	ok(a, "API is defined");
	ok(a.add && typeof a.add === "function", "API has an add method");
});

asyncTest("Should compile", function() {
	Absurd(function(api) {
		api.add({
			body: {
				marginTop: "20px"
			}
		});
	}).compile(function(err, css) {
		alert(css);
		equal(css, 'body {\n  margin-top: 20px;\n}\n');
		start();
	});
});