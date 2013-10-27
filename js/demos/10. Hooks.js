api.hook("add", function(rules) {	
	if(rules.grid) {
		var styles = {};
		styles[rules.grid.parent] = parentStyles = {
			":after": {
				display: "table",
				content: "",
				clear: "both"
			}
		};
		parentStyles[rules.grid.child] = {
			width: (100 / rules.grid.columns) + "%",
			float: "left"
		};
		api.add(styles);
		return true;
	}
});
api.add({
	grid: {
		parent: ".header .menu",
		child: ".link",
		columns: 4
	}
});