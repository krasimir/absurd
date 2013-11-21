var paragraph = { p: "Paragraph text." };
var footer = { footer: "Footer text." };
var body = {
	_include: [
		{ h1: "Title here" },
		paragraph, 
		footer
	]
}
api.morph("html");
api.add({
	html: {
		_include: body
	}
});