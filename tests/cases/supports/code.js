module.exports = function(api) {
	api.add({
		".header": {
			fontSize: "20px",
			"@supports (display: flex) or (display: box)": {
				fontSize: "30px"
			}	
		}
	});
}