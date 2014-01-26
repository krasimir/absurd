'use strict';

var fs = require("fs");

var getVersion = function() {
    return require(__dirname + "/../package.json").version;
}

module.exports = function(grunt) {
    grunt.registerMultiTask('build', 'generate client-side version of the library', function() {

        var content = '',
            self = this,
            version = getVersion();
        
        // generating absurd        
        content += "/* version: "  + version +  " */\n";
    	content += "var Absurd = (function(w) {\n";
        content += grunt.file.read(__dirname + "/tmp/absurd-client-code.js", {});
        content += grunt.file.read(__dirname + "/tmp/absurd.js", {});
        content += ';\nreturn client();\n';
        content += '})(window);';
        grunt.file.write(self.data.dest, content, {});

        // generate organic css
        content = '';
        content += "/* version: "  + version +  " */\n";
        content += "var Organic = (function(w){\n";
        content += grunt.file.read(__dirname + "/tmp/absurd-organic-client-code.js", {});
        content += grunt.file.read(__dirname + "/tmp/absurd-organic.js", {}).replace('// client side port marker', 'return walkClientSide();');
        content += ';\nreturn o.index;\n';
        content += '})(window);';
        grunt.file.write(self.data.organicDest, content, {});

    });
};