var fs = require("fs");

describe("Compile and save", function() {

	var Absurd = require("../../index.js"),
		file = __dirname + '/../data/result/styles.css';

	it("save to file", function(done) {
		if(fs.existsSync(file)) {
			fs.unlinkSync(file);	
		}
		Absurd(__dirname + '/../data/css/header.js').compileFile(
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

	it("save to file using compile method", function(done) {
		if(fs.existsSync(file)) {
			fs.unlinkSync(file);	
		}
		Absurd(__dirname + '/../data/css/header.js').compile(
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