var page = {
	css: {
		".page": {
			marginTop: "20px",
			h2: {
				fontSize: "40px"
			}
		}
	},
	html: {
		\'section.page\': {
			h2: "That\'s a page"
		}
	}
}
api.morph("component").add(page);