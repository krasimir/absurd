module.exports = function(value) {

	var toObj = function(value, r) {
		value = value.replace(/( )?:( )?/, ':').split(':');
		r = r || {};
		r[value[0]] = value[1] || '';
		return r;
	}
	var processArr = function(value) {
		var r = {};
		for(var i=0; i<value.length; i++) {
			toObj(value[i], r);
		}
		return r;
	}

	if(typeof value == 'string') {
		return processArr(value.replace(/( )?\/( )?/g, '/').split('/'));
	} else if(typeof value == 'object') {
		if(!(value instanceof Array)) {
			return value;
		} else {
			return processArr(value);
		}
	}
	
}