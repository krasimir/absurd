'use strict';

var fs = require("fs");

var getVersion = function(callback) {
    var p = require(__dirname + "/../package.json");
    callback(p.version)
}

module.exports = function(grunt) {
    grunt.registerMultiTask('client-side', 'generate client-side version of the library', function() {
        
        // generating absurd

        var tmp = grunt.file.read(this.data.src, {}),
            content = '',
            self = this;

    	content = "var Absurd = (function(w) {\n";

        if(fs.existsSync(__dirname + "/../client-side/lib")) {
			var libs = fs.readdirSync(__dirname + "/../client-side/lib");
			for(var i=0; i<libs.length; i++) {
				var fileContent = fs.readFileSync(__dirname + "/../client-side/lib/" + libs[i], {encoding: 'utf8'});
				content += fileContent + "\n";
			}
		}

        content += tmp;
        content += ';\nreturn client();\n';
        content += '})(window);';

        // generate organic css

        var tmpOrganic = grunt.file.read(this.data.organicSrc, {}),
            contentOrganic = '';

        contentOrganic = "var Organic = (function(w){\n";

        if(fs.existsSync(__dirname + "/../client-side/lib-organic")) {
            var libs = fs.readdirSync(__dirname + "/../client-side/lib-organic");
            for(var i=0; i<libs.length; i++) {
                var fileContent = fs.readFileSync(__dirname + "/../client-side/lib-organic/" + libs[i], {encoding: 'utf8'});
                contentOrganic += fileContent + "\n";
            }
        }

        tmpOrganic = tmpOrganic.replace('// client side port marker', 'return walkClientSide();');

        contentOrganic += tmpOrganic;
        contentOrganic += ';\nreturn o.index;\n';
        contentOrganic += '})(window);';

        getVersion(function(version) {
            grunt.file.write(self.data.dest, "/* version: "  + version +  " */\n" + content, {});
            grunt.file.write(self.data.organicDest, "/* version: "  + version +  " */\n" + contentOrganic, {});
        });

    });
};