module.exports = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var stylesheet = '';
			stylesheet += '@' + value.vendor + 'document';
			stylesheet += ' ' + value.document
			for(var i=0; rule=value.rules[i]; i++) {
				api.handlecssrule(rule, stylesheet)
			}
		}
	}
}