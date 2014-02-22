describe("Testing components (ajax)", function() {

	it("should perform a GET request", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request('data/data.txt')
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe('That\'s a text file');
					done();
				});
			}
		})();
	});

	it("should perform a GET request which fails", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request('data/missingfile')
				.fail(function(xhr) {
					expect(xhr.statusText).toBe('Not Found');
					expect(xhr.status).toBe(404);
					expect(this.__name).toBe('TestingAjax');
					done();
				});
			}
		})();
	});

	it("should perform a GET request with parameters", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data-get.php', data: { a: 'AbsurdJS is a javascript library', b: 'with super powers.' }})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe('AbsurdJS is a javascript library with super powers.');
					done();
				});
			}
		})();
	});

	it("should perform a POST request", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data-post.php', method: 'post'})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe(' ');
					done();
				});
			}
		})();
	});

	it("should perform a POST request which fails", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/missingfile', method: 'post'})
				.fail(function(xhr) {
					expect(xhr.statusText).toBe('Not Found');
					expect(xhr.status).toBe(404);
					expect(this.__name).toBe('TestingAjax');
					done();
				});
			}
		})();
	});

	it("should perform a POST request with parameters", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data-post.php', data: { a: 'AbsurdJS is a javascript library', b: 'with super powers.' }, method: 'post'})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe('AbsurdJS is a javascript library with super powers.');
					done();
				});
			}
		})();
	});

	it("should perform a GET request with custom header set", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data-header.php', headers: { 'absurd-header': 'oh yeah'}})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe('oh yeah');
					done();
				});
			}
		})();
	});

	it("should perform a POST request with custom header set", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data-header.php', headers: { 'absurd-header': 'oh yeah'}, method: 'post'})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data).toBe('oh yeah');
					done();
				});
			}
		})();
	});

	it("should get JSON", function(done) {
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request({url: 'data/data.json', json: true})
				.done(function(data) {
					expect(this.__name).toBe('TestingAjax');
					expect(data.tags.length).toBe(3);
					expect(data.nodejs).toBe(true)
					done();
				});
			}
		})();
	});

	it("'always' handler should work", function(done) {
		var called = 0;
		absurd.component('TestingAjax', {
			constructor: function(ajax) {
				ajax
				.request('data/data.json')
				.always(function(data) {
					called += 1;
					if(called == 2) {
						done();
					}
				});
			}
		})();
	});

});