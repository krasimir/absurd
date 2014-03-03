describe("Testing components (media queries)", function() {

	it("should have the mq as dependency", function(done) {
		absurd.component('TestingMediaQueries', {
			constructor: function(mq) {
				expect(mq).toBeDefined();
				done();
			}
		})();
	});

	it("should use mq", function(done) {
		absurd.component('TestingMediaQueries', {
			secondCheck: function(mq) {
				mq('all and (max-width: 10px)', function(res) {
					expect(this.__name).toBe('TestingMediaQueries');
					expect(res).toBe(false);
					done();
				})
			},
			constructor: function(mq) {
				mq('all and (min-width: 300px)', function(res) {
					expect(this.__name).toBe('TestingMediaQueries');
					expect(res).toBe(true);
					this.secondCheck();
				});
			}
		})();
	});

	it("should use mq with polyfill", function(done) {
		absurd.component('TestingMediaQueries', {
			secondCheck: function(mq) {
				mq('all and (max-width: 10px)', function(res) {
					expect(this.__name).toBe('TestingMediaQueries');
					expect(res).toBe(false);
					done();
				}, true)
			},
			constructor: function(mq) {
				mq('all and (min-width: 300px)', function(res) {
					expect(this.__name).toBe('TestingMediaQueries');
					expect(res).toBe(true);
					this.secondCheck();
				}, true);
			}
		})();
	});

});