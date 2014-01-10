var extend = require("./helpers/extend"),
	fs = require('fs'),
	path = require('path')

var walk = function(dir) {
	// client side port marker
    var results = [];
    var list = fs.readdirSync(dir);
    for(var i=0; i<list.length; i++) {
    	var file = dir + '/' + list[i];
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    }
    return results;
};

module.exports = {
	absurd: null,
	init: function(decoration) {
		if(typeof decoration != 'undefined') {
			this.absurd = decoration;
		}
		// getting atoms and molecules
		var files = walk(__dirname + "/lib/"), self = this;
	    for(var i=0; i<files.length; i++) {
	        var file = path.basename(files[i]);
	        (function(m) {
	        	var module = require(m);
		        self.absurd.plugin(file.replace(".js", ""), function(absurd, value) {
		        	return module(value);
		        });
	        })(files[i]);
	    }
	    // converting snippets to plugins
	    var snippets = require(__dirname + "/helpers/snippets")(),
	    	atoms = require(__dirname + "/lib/atoms/atoms");
	    for(var atom in snippets) {
	    	var pluginName = atom.split(":").shift();
	    	(function(p) {
	    		self.absurd.plugin(p, function(absurd, value) {
		        	return atoms(p + ":" + value);
		        });
	    	})(pluginName);	    	
	    }
	    return this;
	}
}