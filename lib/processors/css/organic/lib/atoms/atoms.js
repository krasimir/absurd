module.exports = function(value) {
	var atoms, r = {}, snippets = require('../../helpers/snippets')();

	if(typeof value == 'string') {
		atoms = value.replace(/ \/ /g, '/').replace(/ \//g, '/').replace(/\/ /g, '/').split('/');
	} else if(typeof value == 'object') {
		if(!(value instanceof Array)) {
			atoms = [];
			for(var key in value) {
				atoms.push(key + ':' + value[key]);
			}
		} else {
			atoms = value;
		}
	}

	var process = function(snippetValue, prefix) {
		snippetValue = snippetValue.split(':');
		var value = snippetValue[1] || '';
		r[snippetValue[0]] = value;
		if(prefix !== false) {
			if(prefix === '' || prefix.indexOf('w') >= 0)
				r['-webkit-' + snippetValue[0]] = value;
			if(prefix === '' || prefix.indexOf('m') >= 0)
				r['-moz-' + snippetValue[0]] = value;
			if(prefix === '' || prefix.indexOf('s') >= 0)
				r['-ms-' + snippetValue[0]] = value;
			if(prefix === '' || prefix.indexOf('o') >= 0)
				r['-o-' + snippetValue[0]] = value;
		}
	}

	// http://docs.emmet.io/css-abbreviations/vendor-prefixes/
	/*
	w: webkit
	m: moz
	s: ms
	o: o
	*/
	var extractPrefix = function(value) {
		var result, parts = value.split(':'), atom = parts[0];
		if(atom.charAt(0) === '-') {
			var tmp = atom.split("-"), a = tmp.pop();
			result = {
				prefix: tmp.join('-')
			}
			value = value.replace(result.prefix, '');
			value = value.substr(1, value.length-1);
			result.atom = value;
		} else {
			result = {
				prefix: false,
				atom: value
			}
		}		
		return result;
	}

	for(var i=0; i<atoms.length; i++) {
		var p = extractPrefix(atoms[i]),
			atom = p.atom, prefix = p.prefix;
		if(atom != '') {
			if(typeof snippets[atom] != 'undefined') {
				process(snippets[atom], prefix);
			} else {
				var atomParts = atom.replace(/: /, ':').split(':'),
					snippetValue = atomParts.pop(),
					snippet = atomParts.join(':');
				if(typeof snippets[snippet] != 'undefined') {
					process(snippets[snippet] + ':' + snippetValue, prefix);
				} else {
					process(atom.replace(/: /, ':'), prefix);
				}
			}
		}
	}
	return r;
}