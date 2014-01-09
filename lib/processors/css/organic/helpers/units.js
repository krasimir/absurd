module.exports = function(v) {
	if(!v.match(/[%|in|cm|mm|em|ex|pt|pc|px]/)) return v + '%';
	else return v;
}