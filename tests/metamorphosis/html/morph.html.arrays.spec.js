describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile nested tags", function(done) {
		var headTags = [
			{ title: "page title" },
			{ style: {} }
		];
		api.morph("html").add({
			html: {
				head: headTags,
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>\npage title\n</title>\n<style/>\n</head>\n<body/>\n</html>');
			done();
		});
	});

	it("should compile list", function(done) {
		var getList = function(data) {
			var list = { ul: [] };
			for(var i=0; item=data[i]; i++) {
				list.ul.push({ li:item });
			}
			return list;
		}
		api.morph("html").add({
			html: {
				body: getList(["A", "B", "C", "D"])
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<body>\n<ul>\n<li>\nA\n</li>\n<li>\nB\n</li>\n<li>\nC\n</li>\n<li>\nD\n</li>\n</ul>\n</body>\n</html>');
			done();
		});
	});

});