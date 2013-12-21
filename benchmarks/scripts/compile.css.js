var api = require("../../index.js")();
module.exports = function() {
	api.add({
		body: {
			section: {
				marginTop: "20px"
			},
			p: {
				span: {
					fontSize: "20px"
				}
			}
		}
	}).add({
		body: {
			lineHeight: "20px"
		},
		header: {
			marginTop: "20px"
		}
	}).compile(function(err, css) {
		
	});
}