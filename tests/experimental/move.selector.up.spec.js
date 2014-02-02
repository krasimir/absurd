describe("Moving a selector to the top of the chain", function() {

	it("should move a selector", function(done) {
		api.add({
		    '.test': {
		        '.some, .sel': {
		            '^html.ie8': {
		                color: "#333"
		            },
		            width: "100%"
		        }
		    }
		}).compile(function(err, css) {
			done();
			console.log(css);
		}, { minify: false });
	});

});