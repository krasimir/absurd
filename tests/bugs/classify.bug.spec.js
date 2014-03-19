describe("Can't compile style with classify property", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		var foo = function(x){
		    return {
		        classify: true,
		        toJSON: function(){
		            return{
		                width: 200 + x + 'px'
		            }
		        }
		    };
		};
		api.add({
			'.foo': foo(10)
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBe(".foo{width: 210px;}");
			done();
		}, {minify: true});
	})

});