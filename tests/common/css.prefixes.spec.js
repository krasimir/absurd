describe("CSS prefixes", function() {

	var api = require('../../index.js')();

	it("should use prefixes", function(done) {
		api.add({
			body: {
				p: {
					marginTop: '1px 0',
					'-border-radius': '10px',
					fontSize: '20px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{margin-top: 1px 0;border-radius: 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;-ms-border-radius: 10px;-o-border-radius: 10px;font-size: 20px;}');
			done();
		}, { minify: true });
	});

	it("should use only specific prefixes", function(done) {
		api.add({
			body: {
				p: {
					'-wm-border-radius': '10px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;}');
			done();
		}, { minify: true });
	});

	it("should use only one prefix", function(done) {
		api.add({
			body: {
				p: {
					'-s-border-radius': '10px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 10px;-ms-border-radius: 10px;}');
			done();
		}, { minify: true });
	});

	it("should use prefixes with plugin", function(done) {
		api.plugin('awesome', function(api, value, prefix) {	
			var r = {};
			r[prefix + 'borderRadius'] = value + "px";
			return r;
		});
		api.add({
			body: {
				p: {
					'-sw-awesome': 20
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 20px;-webkit-border-radius: 20px;-ms-border-radius: 20px;}');
			done();
		}, { minify: true });
	});

});