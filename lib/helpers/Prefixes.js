// http://docs.emmet.io/css-abbreviations/vendor-prefixes/ (w: webkit, m: moz, s: ms, o: o)
var prefixExtract = function(prop) {
	var result, match;
	if((match = prop.match(/^\-(w|m|s|o)+\-/) || prop.charAt(0) === '-') && !prop.match(/^\-(webkit|moz|ms)+\-/)) {
		if(match !== null && match[0]) {
			result = { prefix: match[0].replace(/-/g, '') }
			result.prop = prop.replace(match[0], '');
		} else {
			result = { prefix: '' }
			result.prop = prop.substr(1, prop.length);
		}
	} else {
		result = {
			prefix: false,
			prop: prop
		}
	}
	return result;
}
module.exports = {
	addPrefixes: function(prop, obj) {
		var originalProp = prop, p = prefixExtract(prop), value = obj[prop];
		if(p.prefix !== false) {
			delete obj[originalProp];
			obj[p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('w') >= 0)
				obj['-webkit-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('m') >= 0)
				obj['-moz-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('s') >= 0)
				obj['-ms-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('o') >= 0)
				obj['-o-' + p.prop] = value;
		}
	},
	nonPrefixProp: function(prop) {
		var p = prefixExtract(prop);
		if(p.prefix !== false) {
			if(p.prefix == '') { 
				p.prefix = '-';
			} else {
				p.prefix = '-' + p.prefix + '-'; 
			}
		}
		return p;
	}
}