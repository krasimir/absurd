describe("Should use jsonify", function() {

	var api = require('../../index.js')();
	var api2 = require('../../index.js')();
	var css = '@keyframes NAME-YOUR-ANIMATION {\n\
0% {\n\
  opacity: 0;\n\
}\n\
100% {\n\
  opacity: 1;\n\
}\n\
}\n\
@-webkit-keyframes NAME-YOUR-ANIMATION {\n\
0% {\n\
  opacity: 0;\n\
}\n\
100% {\n\
  opacity: 1;\n\
}\n\
}\n\
.header {\n\
  margin: 0;\n\
  font-size: 20px;\n\
}\n\
.header p {\n\
  line-height: 22px;\n\
  box-sizing: border-box;\n\
}\n\
@media all and (max-width: 460px) {\n\
  .header p {\n\
    line-height: 33px;\n\
    color: #000;\n\
    padding-top: 10px;\n\
  }\n\
}\n';

	it("should compile properly by using jsonify", function(done) {
		api
		.morph('jsonify')
		.add({
			body: {
				p: { fz: '20px'},
				a: { ted: 'n'}
			},
			'@media all and (max-width: 330px)': {
				p: { fz: '22px' }
			}
		})
		.compile(function(err, json) {
			expect(JSON.stringify(json)).toBe('{"body":{"p":{"fz":"20px"},"a":{"ted":"n"}},"@media all and (max-width: 330px)":{"p":{"fz":"22px"}}}');
			done();
		});
	});	

	it("should compile properly by using jsonify and importCSS", function(done) {
		api
		.morph('jsonify')
		.importCSS(css)
		.compile(function(err, json) {
			api2.add(json).compile(function(err, cssFinal) {
				expect(css).toBe(cssFinal);
				done();
			});
		});
	});

});