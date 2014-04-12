describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use classes", function(done) {
		var tags = {
			"div.content": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use two classes", function(done) {
		var tags = {
			"div.content.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use id", function(done) {
		var tags = {
			"div#content": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div id="content"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use id and class together", function(done) {
		var tags = {
			"div.content#home.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use without tag name", function(done) {
		var tags = {
			".content#home.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content[data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"]#home': {
				'img[alt="that\'s my image" some__data="1"]': null
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content" id="home" data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"><img alt="that\'s my image" some__data="1"/></div>');
			done();
		}, { minify: true });
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content.left#wrapper': {
				'a[href="http://krasimir.github.io/absurd/"]': "AbsurdJS documentation",
				'p.text[title="description" data-type="selectable"]': "CSS preprocessor"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="wrapper"><a href="http://krasimir.github.io/absurd/">AbsurdJS documentation</a><p class="text" title="description" data-type="selectable">CSS preprocessor</p></div>');
			done();
		}, { minify: true });
	});

	it("should create a div by default", function(done) {
		var tags = {
			'[class="content"]': "test"
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">test</div>');
			done();
		}, { minify: true });
	});

});