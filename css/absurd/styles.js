var base = function() {
	return {
		"html, body": {
			margin: 0,
			padding: 0,
			width: "100%",
			height: "100%",
			fontFamily: "Georgia",
			fontSize: "20px",
			lineHeight: "24px"
		},
		h1: title(),
		h2: title(30),
		".clear": {
			clear: "both"
		},
		".centered": {
			textAlign: "center"
		}
	}
}
var title = function(size) {
	size = size ? size : 60;
	return {
		textAlign: "center",
		fontWeight: "normal",
		fontSize: size + "px",
		padding: size + "px 0 " + (size/2) + "px 0",
		margin: "0"
	}
}
var demoBlock = function() {
	return {
		width: "50%",
		height: "500px",
		border: "dotted 1px #C9C9C9",
		background: "solid 1px #C9C9C9",
		float: "left",
		boxSizing: "border-box",
		MozBoxSizing: "border-box"
	}
}
var social = function(api) {
	var color = "#E0E2D1";
	return {
		".social": {
			background: "#ECECEC",
			padding: "20px",
			boxSizing: "border-box",
			MozBoxSizing: "border-box",
			textAlign: "center"
		}
	}
}
var demo = function() {
	return {
		".content": {
			margin: "20px 0 20px 0"
		},
		".editor-wrapper": demoBlock(),
		".result": [
			demoBlock(), 
			{
				fontSize: "18px",
				overflow: "auto",
				paddingLeft: "10px"
			},
			{
				pre: {
					margin: 0,
					padding: 0,
					wordWrap: "break-word"
				}
			}
		],
		"#editor": {
			width: "100%",
			height: "100%"
		},
		".compile": {
			display: "block",
			width: "140px",
			margin: "40px auto",
			textDecoration: "none",
			color: "#000",
			background: "#B1E9B1",
			textAlign: "center",
			fontSize: "20px",
			padding: "6px 10px",
			borderRadius: "6px",
			border: "solid 1px #4FBB4F",
			boxShadow: "0px 0px 6px #888888",
			lineHeight: "18px",
			":hover": {
				background: "#74DF68"
			},
			small: {
				fontSize: "11px",
				lineHeight: "11px"
			}
		}
	};
}

var demoStyles = function() {
	return {
		".demo": {
			maxWidth: "1200px",
			margin: "0 auto"
		},
		".demo-selector": {
			textAlign: "center",
			paddingBottom: "20px",
			select: {
				padding: "6px 8px 6px 6px",
				border: "solid 2px #C2C2C2",
				borderRadius: "10px",
				minWidth: "240px",
				fontSize: "18px",
				fontFamily: "Georgia"
			}
		}
	}
}

var menu = function(api) {
	return {
		".menu": {
			background: "#575757",
			boxSizing: "border-box",
			MozBoxSizing: "border-box",
			color: "#FFF",
			padding: "60px 0 60px 0",
			borderTop: "solid 1px #FFF",
			borderBottom: "solid 1px #6C6C6C",
			p: {
				margin: "0 auto",
				fontSize: "30px",
				lineHeight: "30px",
				a: {
					display: "block",
					color: "#FFF",
					textDecoration: "none",
					textShadow: "1px 1px #000",
					":hover": {
						textShadow: "3px 3px #000",
					},
					small: {
						fontSize: "18px",
						color: api.darken("#FFF", 20)
					}
				}
			},
			hr: {
				display: "block",
				borderTop: "none",
				borderBottom: "solid 1px #000",
				margin: "20px auto"
			},
			section: {
				width: "50%",
				boxSizing: "border-box",
				float: "left"
			},
			".menu-inner": {
				maxWidth: "950px",
				margin: "0 auto",
				":after": {
					content: "",
					display: "table",
					clear: "both"
				}
			},
			".must-read": {
				img: {
					width: "356px",
					display: "block",
					margin: "0 auto 30px auto"
				},
				p: {
					lineHeight: "20px"
				}
			}
		}
	}
}

module.exports = function(api) {
	api
	.add(base())
	.add(demo())
	.add(social(api))
	.add(menu(api))
	.add(demoStyles())
	.import(__dirname + "/documentation.js");
}