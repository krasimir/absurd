var base = function() {
	return {
		".clear": {
			clear: "both"
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
		height: "420px",
		padding: "20px 10px 20px 10px",
		borderTop: "solid 2px #C9C9C9",
		borderBottom: "solid 2px #C9C9C9",
		background: "solid 1px #C9C9C9",
		float: "left",
		boxSizing: "border-box",
		MozBoxSizing: "border-box"
	}
}

var footer = function(api) {
	var color = "#E0E2D1";
	return {
		footer: {
			background: color,
			padding: "20px",
			boxSizing: "border-box",
			MozBoxSizing: "border-box",
			textAlign: "center",
			color: api.darken(color, 50),
			a: {
				color: api.darken(color, 50),
				textDecoration: "none",
				":hover": {
					color: api.darken(color, 80)
				}
			}
		}
	}
}

module.exports = function(api) {
	api
	.add(base())
	.add({
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
		".content": {
			margin: "20px 0 20px 0"
		},
		".editor-wrapper": demoBlock(),
		".result": [
			demoBlock(), 
			{fontSize: "18px"},
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
	})
	.add(footer(api));
}