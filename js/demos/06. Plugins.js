api.plugin("hoverEffect", function(api, color) {
	return {
		":hover": {
			color: color
		}
	}
})
api.add({
	a: {
		color: "#000",
		hoverEffect: "#999"
	}
});