module.exports = function(api) {
	var mainColor = "#353535";
	api.add({
		".documentation": {
			color: "#FFF",
			background: mainColor,
			boxSizing: "border-box",
			MozBoxSizing: "border-box",
			".documentation-inner": {
				maxWidth: "950px",
				margin: "0 auto"
			},
			h2: {
				fontSize: "50px",
				lineHeight: "50px"
			},
			h3: {
				display: "inline-block",
				textAlign: "left",
				fontSize: "30px",
				margin: "40px 0 40px 0",
				padding: 0,
				boxSizing: "border-box",
				MozBoxSizing: "border-box",
				float: "left",
				width: "50%",
				fontWeight: "normal"
			},
			".code": {
				float: "left",
				width: "50%"	
			}
		}
	})
}