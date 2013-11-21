api.morph("html");
api.add({ 
	p: "text here"
}, "paragraph");
api.add({ 
	\'div[class="footer" data-behaviour="clickable"]\': {
		_: "footer"
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