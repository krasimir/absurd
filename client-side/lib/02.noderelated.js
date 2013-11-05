var require = function(v) {
	switch(v) {
		case "/../processors/html/HTML.js":
			return lib.processors.html.HTML;
		break;
	}
	return function() {}
};
var __dirname = "";