describe("Wrong output on combineSelectors:false", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var css = {};
		css['.clearfix'] = {
		  '*zoom': 1,
		  '&:before, &:after': {
		    display: 'table',
		    content: '',
		    lineHeight: 0,
		  },
		  '&:after': {
		    clear: 'both',
		  },
		};
		api.add(css, { combineSelectors: false });
		api.compile(function(err, css) {
			expect(css).toBe('.clearfix{*zoom: 1;}.clearfix:before,.clearfix:after{display: table;content: "";line-height: 0;}.clearfix:after{clear: both;}');
			done();
		}, {minify: true, combineSelectors: false});
	})

});