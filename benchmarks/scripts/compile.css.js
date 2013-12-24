var api = require("../../index.js")();
api.plugin("hoverEffect", function(api, color) {
	return {
		":hover": {
			color: color,
            background: api.lighten(color, 60)
		}
	}
})
module.exports = function() {
	api.add({
		body: {
			section: {
				marginTop: "20px"
			},
			p: {
				span: {
					fontSize: "20px",
					hoverEffect: '#999'
				}
			}
		}
	}).add({
		body: {
			lineHeight: "20px"
		},
		header: {
			marginTop: "20px",
			hoverEffect: '#999'
		}
	}).compile(function(err, css) {
		
	});
}