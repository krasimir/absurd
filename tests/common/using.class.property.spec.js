describe("Using class as property", function() {

	var absurd = require('../../index.js')();

	it("should use classify with toString", function(done) {
		var px = function(wid) {
			var api = {
				classify: true,
				add: function(mar) {
					wid += mar;
					return this;
				},
				toString: function() {
					return wid + 'px';
				}
			}
			return api;
		};
		absurd.add({
			body: {
				width: px(40).add(10)
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{width: 50px;}');
			done();
		}, { minify: true });
	});

	it("should use classify with toJSON", function(done) {
		var size = function(wid) {
			var api = {
				classify: true,
				add: function(mar) {
					wid += mar;
					return this;
				},
				toString: function() {
					return wid + 'px';
				},
				toJSON: function() {
					return {
						wid: wid + 'px'
					}
				}
			}
			return api;
		};
		absurd.add({
			body: {
				p: size(40).add(10)
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{width: 50px;}');
			done();
		}, { minify: true });
	});

});