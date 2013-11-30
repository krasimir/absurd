describe("API(add)", function() {

	var api = require('../../index.js')();
	var exec = require('child_process').exec;

	var shell = function(cmd, callback) {
		cmd = "node " + __dirname + "/../../index.js " + cmd;
		exec(cmd, function (error, stdout, stderr) {
		    // console.log('stdout: "' + stdout + '"');
		    // console.log('stderr: "' + stderr + '"');
		    callback(stderr, stdout);
		}, { encoding: 'utf8'});
	}

	it("should use -s (source) option", function(done) {
		shell("-s ./tests/data/styles.json", function(err, res) {
			expect(err).toBe("");
			expect(res).toBe("body {\n\
  margin: 0;\n\
  padding: 0;\n\
  font-size: 1em;\n\
}\n\
body p {\n\
  line-height: 30px;\n\
}\n\n\
")
			done();
		});
	});

	it("should use -m (minify) option", function(done) {
		shell("-s ./tests/data/styles.json -m true", function(err, res) {
			expect(err).toBe("");
			expect(res).toBe("body{margin: 0;padding: 0;font-size: 1em;}body p{line-height: 30px;}\n");
			done();
		});
	});

	it("should use -m (minify) option", function(done) {
		shell("-s ./tests/data/html.json -t html", function(err, res) {
			expect(err).toBe("");
			expect(res).toBe("<!DOCTYPE html>\n\
\n\
<head>\n\
    <title>AbsurdJS is awesome</title>\n\
</head>\n\
\n\
<body>\n\
    <div class=\"container\">\n\
        <p>text here</p>\n\
    </div>\n\
</body>\n");
			done();
		});
	});

	it("should use -k (keep camel case) option", function(done) {
		shell("-s ./tests/data/css/keepcamelcase.json -k true", function(err, res) {
			expect(err).toBe("");
			expect(res).toBe("body {\n  lineHeight: 20px;\n}\n\n");
			done();
		});
	});

});