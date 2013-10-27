api.register("buttonize", function(selector) {
	var styles = {};
	styles[selector] = {
		cursor: "pointer",
		display: "block",
		background: "#aaa",
		":hover": {
			background: "#ddd"
		}
	};
	api.add(styles);
});
api.buttonize(".header a");