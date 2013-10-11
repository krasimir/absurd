api.storage("theme", function(color) {
	return {
		color: color,
		background: api.lighten(color, 50)
	}
});
api.add({
	body: {
		width: "100%",
		height: "100%",
		section: [
			api.storage("theme")("#999"),
			{
				marginTop: "20px"
			}
		]
	}
});