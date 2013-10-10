'use strict';

var fs = require("fs");

var addAnchor = function(tag, str) {
	var r = new RegExp("<" + tag + ">(.*)<\/" + tag + ">", "gi");
	var items = str.match(r);
	for(var i=0; i<items.length; i++) {
		var item = items[i];
		var text = item.replace("<" + tag + ">", "").replace("</" + tag + ">", "");
		var ahchor = text;
		ahchor = ahchor.replace(/ /gi, "-");
		ahchor = ahchor.replace(/'/gi, "");
		ahchor = ahchor.replace(/\"/gi, "");
		ahchor = ahchor.replace(/\./gi, "");
		ahchor = ahchor.replace(/\!/gi, "");
		ahchor = ahchor.replace(/\?/gi, "");
		ahchor = ahchor.replace(/\(/gi, "");
		ahchor = ahchor.replace(/\)/gi, "");
		ahchor = ahchor.replace(/\[/gi, "");
		ahchor = ahchor.replace(/\]/gi, "");
		ahchor = ahchor.replace(/\|/gi, "");
		ahchor = ahchor.replace(/,/gi, "");
		ahchor = ahchor.toLowerCase();
		var r = new RegExp("<" + tag + ">" + text + "<\/" + tag + ">", "gi");
		str = str.replace(r, "<" + tag + "><a href=\"#" + ahchor + "\" name=\"" + ahchor + "\">&#187;</a>" + text + "<\/" + tag + ">");
	}
	return str;
}

module.exports = function(grunt) {
    grunt.registerMultiTask('generate-index', 'generating index.html', function() {

        var indexTpl = grunt.file.read(this.data.src, {});
        var docsTpl = grunt.file.read(__dirname + "/../tpl/docs.html", {});

        docsTpl = addAnchor("h2", docsTpl);
        docsTpl = addAnchor("h3", docsTpl);
        docsTpl = addAnchor("h4", docsTpl);
        
        grunt.file.write(this.data.dest, indexTpl.replace("{{docs}}", docsTpl), {});

    });
};