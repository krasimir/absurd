describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should use classes", function(done) {
		var tags = {
			"div.content": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use two classes", function(done) {
		var tags = {
			"div.content.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use id", function(done) {
		var tags = {
			"div#content": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div id="content">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use id and class together", function(done) {
		var tags = {
			"div.content#home.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use without tag name", function(done) {
		var tags = {
			".content#home.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content[data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"]#home': {
				'img[alt="that\'s my image" some__data="1"]': {}
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content" id="home" data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;">\n<img alt="that\'s my image" some__data="1"/>\n</div>');
			done();
		});
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content.left#wrapper': {
				'a[href="http://krasimir.github.io/absurd/"]': "AbsurdJS documentation",
				'p.text[title="description" data-type="selectable"]': "CSS preprocessor"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="wrapper">\n\
<a href="http://krasimir.github.io/absurd/">\n\
AbsurdJS documentation\n\
</a>\n\
<p class="text" title="description" data-type="selectable">\n\
CSS preprocessor\n\
</p>\n\
</div>');
			done();
		});
	});

});