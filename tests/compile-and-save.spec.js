var fs = require("fs");

describe("Nested selectors", function() {

	var Absurd = require("../index.js"),
		file = __dirname + '/data/result/styles.css';

	it("should use nesting", function(done) {
		if(fs.existsSync(file)) {
			fs.unlinkSync(file);	
		}
		Absurd(__dirname + '/data/css/header.js').compileFile(
			file,
			function(err, css) {
				expect(err).toBe(null);
				expect(css).toBeDefined();
				expect(fs.existsSync(file)).toBe(true);
				expect(fs.readFileSync(file, {encoding: 'utf-8'})).toContain('background: #BADA55');
				done();
			}
		);
	});

});