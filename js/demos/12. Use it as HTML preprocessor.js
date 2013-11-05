api.morph("html");
api.add({ p: "text here" }, "paragraph");
api.add({ 
	div: {
		_: "footer",
		_attrs: { 
			class: "footer", 
			dataBehaviour: "clickable" 
		}
	}
}, "footer");
api.add({
	html: {
		head: {
			title: "AbsurdJS is awesome"
		},
		body: {
			_: "<h1>AbsurdJS</h1>",
			_tpl: ["paragraph", "footer"]
		}
	}
});