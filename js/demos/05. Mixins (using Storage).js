// single value
api.storage("fontsize", "16px");
// multiple values
api.storage({
	color: "red",
	theme: function(color) {
		return {
			color: color,
			background: api.lighten(color, 50)
		}
	}
});
api.add({
	body: {
		background: api.storage("color"),
		section: [
			api.storage("theme")("#999"),
			{ marginTop: "20px" },
			{ fontSize: api.storage("fontsize") }
		]
	}
});