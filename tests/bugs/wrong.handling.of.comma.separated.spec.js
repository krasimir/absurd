describe("Wrong handling of Array of Objects in Comma Separated Nested-Selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		// single value
		api.storage("fontsize", "16px");
		// multiple values
		api.storage({
		    color: "red",
		    theme: function(color) {
		        return {
		            color: color,
		            background: api.lighten(color, 50)
		        }
		    }
		});
		api.add({
		    body: {
		        background: api.storage("color"),
		        "section a, section div": [
		            api.storage("theme")("#999"),
		            { marginTop: "20px" },
		            { fontSize: api.storage("fontsize") }
		        ]
		    }
		});
		api.compile(function(err, css) {
			expect(css).toBe('body{background: red;}body section a,body section div{color: #999;background: #e6e6e6;margin-top: 20px;font-size: 16px;}');
			done();
		}, {minify: true})
	});

})