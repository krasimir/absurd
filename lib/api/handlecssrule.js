module.exports = function(api) {

	var handleRuleCSS = function(rule, stylesheet) {
		var absurdObj = {}, absurdProps = {};
		if(rule.declarations && rule.declarations.length > 0) {
			for(var i=0; decl=rule.declarations[i]; i++) {
				if(decl.type === "declaration") {
					absurdProps[decl.property] = decl.value;
				}
			}
			if(rule.selectors && rule.selectors.length > 0) {
				for(var i=0; selector=rule.selectors[i]; i++) {
					absurdObj[selector] = absurdProps;
				}
			}
			api.add(absurdObj, stylesheet);
		}
		return api;
	}

	return handleRuleCSS;	
}