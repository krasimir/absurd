module.exports = function(api) {
	var mainColor = "#353535";
	var hLink = function(size) {
		return {
			display: "inline-block",
			color: "#696969",
			marginRight: "10px",
			textDecoration: "none",
			opacity: 0,
			margin: "0 0 0 -" + (size - 5) + "px"
		};
	}
	var hHover = function() {
		return {
			a: {
				opacity: 1
			}
		};
	}
	api.add({
		".documentation": {
			color: "#FFF",
			background: mainColor,
			boxSizing: "border-box",
			MozBoxSizing: "border-box",
			paddingTop: "100px",
			paddingBottom: "100px",
			".documentation-inner": {
				maxWidth: "950px",
				margin: "0 auto",
				section: {
					borderBottom: "dotted 1px #000",
					marginTop: "20px",
					paddingBottom: "20px"
				}
			},
			h2: {
				fontSize: "50px",
				lineHeight: "50px",
				borderBottom: "solid 4px #FFF",
				textAlign: "left",
				a: hLink(50),
				":hover": hHover()
			},
			h3: {
				fontSize: "40px",
				lineHeight: "40px",
				borderBottom: "dotted 2px #666666",
				textAlign: "left",
				fontWeight: "normal",
				paddingBottom: "20px",
				a: hLink(40),
				":hover": hHover()
			},
			h4: {
				display: "inline-block",
				textAlign: "left",
				fontSize: "30px",
				margin: "10px 0 10px 0",
				padding: "0 10px 0 0 ",
				boxSizing: "border-box",
				MozBoxSizing: "border-box",
				fontWeight: "normal",
				lineHeight: "40px",
				color: "#8C8C8C",
				a: hLink(30),
				":hover": hHover()
			},
			p: {
				padding: "0 20px 0 0",
				margin: 0,
				fontSize: "18px",
				lineHeight: "24px",
				color: "#8C8C8C",
				a: {
					color: "#FFF"
				}
			},
			".desc": {
				float: "left",
				width: "30%",
				a: {
					color: "#FFF"
				}
			},
			".code": {
				float: "left",
				width: "70%",
				boxSizing: "border-box",
				MozBoxSizing: "border-box"
			},
			".menu": {
				a: {
					color: "#FFF",
					":hover": {
						textDecoration: "none"
					}
				}
			}
		}
	})
}