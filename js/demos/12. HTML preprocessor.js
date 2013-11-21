api.morph("html");
api.add({
	html: {
		head: {
			title: "AbsurdJS is awesome"
		},
		body: {
			\'h1[class="title"]\': "Title here"
		}
	}
});