api.morph("html");
api.add({
	html: {
		head: {
			title: "AbsurdJS is awesome"
		},
		body: {
			\'.content.left#wrapper\': {
				\'a[href="http://krasimir.github.io/absurd/"]\': "AbsurdJS documentation",
				\'p.text[title="description" data-type="selectable"]\': "CSS preprocessor"
			}
		}
	}
});