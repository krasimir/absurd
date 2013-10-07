module.exports = function(api) {	
	api.add({
		document: {
			vendor: "-moz-",
			document: "url-prefix()",
			styles: {
				'.ui-select .ui-btn select': {
			    	opacity: '.0001'
			  	}
			}
		}
	});
}