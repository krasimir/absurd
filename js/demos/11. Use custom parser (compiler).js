var processor = function(rules, callback, options) {
	callback(null, rules);
};
api.add({
	body: {
		p: { fontSize: "20px" },
		section: { background: "#BADA55" }
	}
});
api.compile(function(err, json) {
	// json object here contains the raw
	// information stored in Absurd.
	// Check your console to see the result.
	console.log(json);
}, { processor: processor });