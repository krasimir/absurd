api.plugin("hoverEffect", function(api, color) {
	return {
		":hover": {
			color: color,
            background: api.lighten(color, 60)
		}
	};
});
api.add({
	a: {
		color: "#000",
		hoverEffect: "#999"
	}
});