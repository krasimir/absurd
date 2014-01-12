describe("Testing atoms", function() {

	var api = require('../../index.js')();

	it("should use atom 1", function(done) {
		api.add({
			body: {
				atoms: {
					pad: '10px',
					fz: '16px',
					d: 'b'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 2", function(done) {
		api.add({
			body: {
				atoms: ['pad: 10px', 'fz : 16px', 'd:b']
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 3", function(done) {
		api.add({
			body: {
				atoms: 'pad:10px/fz:16px/d:b'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 4", function(done) {
		api.add({
			body: {
				pad: '10px',
				fz: '16px',
				d: 'b'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use prefixes", function(done) {
		api.add({
			body: {
				atoms: '-bxz:bb'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;-ms-box-sizing: border-box;-o-box-sizing: border-box;}');
			done();
		}, { minify: true})
	});

	it("should use only few prefixes", function(done) {
		api.add({
			body: {
				atoms: '-mw-bxz:bb',
				p: {
					atoms: '-w-trs: all 4000ms'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;}body p{transition: all 4000ms;-webkit-transition: all 4000ms;}');
			done();
		}, { minify: true})
	});

	it("should use atom with function and prefix", function(done) {
		api.add({
			body: {
				p: [
					{ d: 'b' },
					{
						'-ws-pos': function() {
							return 'static';
						}
					}
				]
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{display: block;position: static;-webkit-position: static;-ms-position: static;}');
			done();
		}, { minify: true})
	});

});