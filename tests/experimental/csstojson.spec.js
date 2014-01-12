describe("CSS to JSON", function() {

	it("should compile CSS to JSON", function(done) {

		var parser = require("../../lib/helpers/CSS2JSON");
		var css = '\n\n\n\
body {\n\
	margin-top: 20px;\n\
	padding:10px;\n\
}\n\
@media all and (max-width: 200px) {\n\
	body{\n\
		font-size: 10px;\n\
	}\n\
	p {\n\
		line-height: 20px;\n\
	} \n\
}\n\n\
/* Imports here */\n\
@import url("fineprint.css") print;\n\
@import url("bluish.css") projection, tv;\n\
@import \'custom.css\';\n\
@import "common.css" screen, projection;\n\
@import url(\'landscape.css\') screen and (orientation:landscape);\n\
body p{\n\
	font-size: 12px;\n\
	a {\n\
		color: #FFF;\n\
		d: b;\n\
		fz: 20px;\n\
	}\n\
	a:after {\n\
		content : " ";\n\
		display: block;\n\
	}\n\
}\n\
@keyframes fade {from\n\
  {opacity: 0;\n\
     }\n\
to\n\
  {\n\
     opacity: 1;}}\n\
';

		parser(css);

		done();

	});

});