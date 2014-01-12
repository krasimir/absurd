module.exports = function(v, def) {
	if(!v.toString().match(/[%|in|cm|mm|em|ex|pt|pc|px|deg|ms|s]/)) return v + (def || '%');
	else return v;
}