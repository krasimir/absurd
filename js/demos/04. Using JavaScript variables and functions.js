var themeColor = "#BADA55";
var textStyles = function(size) {
	return {
		color: themeColor,
		fontSize: size + "px",
		lineHeight: size + "px"
	}
}
api.add({
	body: {
		color: function() {
			return "#000"
		},
		p: textStyles(16),
		h1: [
			textStyles(50),
			{ lineHeight: "60px" } 
		]
	}
});