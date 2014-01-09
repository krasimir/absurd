module.exports = function(value) {
	var r = {}, clearing = {
		content: '" "',
		display: 'table',
		clear: 'both'
	};
	switch(value) {
		case 'before':
			r['&:before'] = clearing;
		break;
		case 'after':
			r['&:after'] = clearing;
		break;
		default: 
			r['&:before'] = clearing;
			r['&:after'] = clearing;
		break;
	}
	return r;
}