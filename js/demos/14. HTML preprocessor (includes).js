var paragraph = { p: "Paragraph text." };
var footer = { footer: "Footer text." };
var body = {
	h1: "Title here",
	_include: [paragraph, footer]
}
api.morph("html");
api.add({
	html: {
		_include: body
	}
});