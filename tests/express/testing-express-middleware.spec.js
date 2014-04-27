var path = require('path'),
	fs = require('fs');

/* ExpressJS mockup */
var ExpressMock = function() {
	var api = {}, data = {}, engines = {}, middlewares = [];
	api.set = function(key, value) { data[key] = value; }
	api.get = function(key) { return data[key]; }
	api.engine = function(ext, fn) {
		engines[ext] = fn;
	}
	api.render = function(name, opts, cb) {
		var filePath = path.join(this.get('views'), name);
		var ext = name.split('.').pop().toLowerCase();
		var engine = engines[ext];
		if(engine) {
			engine(filePath, opts, cb);
		} else {
			throw new Error('There is no engine for ' + ext + ' files.');
		}
	}
	api.use = function(func) {
		middlewares.push(func);
	}
	api.simulate = function(file, done) {
		var req = {
			method: 'GET',
			url: '/' + file
		}
		var res = {}
		api.use(done);
		(function process() {
			if(middlewares.length > 0) {
				var m = middlewares.shift();
				m(req, res, process);
			}
		})();
	}
	return api;
}

describe("Express middleware", function() {

	var absurd = require('../../index.js')();

	it("should use express middleware for rendering HTML (js)", function(done) {
		var app = ExpressMock();
		app.set('views', path.join(__dirname, 'views'));
		app.engine('js', absurd.express({ morph: 'html' }));
		app.render('page.js', { data: { title: 'Testing Express' }, minify: true }, function(err, html) {
			expect(html).toBe('<h1>Testing Express</h1><p>Welcome to Testing Express</p>');
			done();
		});
	});

	it("should use express middleware for rendering HTML (json)", function(done) {
		var app = ExpressMock();
		app.set('views', path.join(__dirname, 'views'));
		app.engine('json', absurd.express({ morph: 'html' }));
		app.render('page.json', { data: { title: 'Testing Express' }, minify: true }, function(err, html) {
			expect(html).toBe('<h1>Testing Express</h1><p>Welcome to Testing Express</p>');
			done();
		});
	});

	it("should use express middleware for rendering HTML (yaml)", function(done) {
		var app = ExpressMock();
		app.set('views', path.join(__dirname, 'views'));
		app.engine('yaml', absurd.express({ morph: 'html' }));
		app.render('page.yaml', { data: { title: 'Testing Express' }, minify: true }, function(err, html) {
			expect(html).toBe('<h1>Testing Express</h1><p>Welcome to Testing Express</p>');
			done();
		});
	});

	it("should use express middleware for compiling CSS", function(done) {
		var app = ExpressMock();
		var options = {
			src: path.join(__dirname, 'styles'),
		    dest: path.join(__dirname, 'public/styles'),
			prefix: '/styles',
		    minify: true
		};
		app.use(absurd.express(options));
		app.simulate('site.css', function(req, res, next) {
			var siteCSS = options.dest + '/site.css';
			expect(fs.existsSync(siteCSS)).toBe(true);
			expect(fs.readFileSync(siteCSS).toString()).toBe('body{padding: 50px;font: 14px "Lucida Grande",Helvetica,Arial,sans-serif;}a{color: #00B7FF;}.content{font-size: 20px;}');
			done();
		});
	});

	it("should use express middleware (jsonify)", function(done) {
		var app = ExpressMock();
		var options = {
			morph: 'jsonify',
			src: path.join(__dirname, 'styles'),
		    dest: path.join(__dirname, 'public/styles'),
			prefix: '/styles',
		    minify: true
		};
		app.use(absurd.express(options));
		app.simulate('tojson.json', function(req, res, next) {
			var siteJSON = options.dest + '/tojson.json';
			expect(fs.existsSync(siteJSON)).toBe(true);
			expect(fs.readFileSync(siteJSON).toString()).toBe('{"body":{"pad":"50px","font":"14px \\"Lucida Grande\\", Helvetica, Arial, sans-serif"},"a":{"color":"#00B7FF"},".content":{"fz":"20px"}}');
			done();
		});
	});

});