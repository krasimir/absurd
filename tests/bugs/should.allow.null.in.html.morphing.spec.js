describe("Should allow the usage of null param in the HTML morphing", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.morph('html').add({
			'form' : {
			    'input#myId.clas1.clas2': null
			}
		}).compile(function(err, html) {
			expect(html).toBe('<form><input class="clas1 clas2" id="myId"/></form>');
			done();
		}, { minify: true });
	});

	it("should compile properly (diff between null and empty string)", function(done) {
		api.morph('html').add({
			'form' : {
			    'input#myId.clas1.clas2': null,
			    'i.fa.fa-home': ''
			}
		}).compile(function(err, html) {
			expect(html).toBe('<form><input class="clas1 clas2" id="myId"/><i class="fa fa-home"></i></form>');
			done();
		}, { minify: true });
	});

});