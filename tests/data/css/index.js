module.exports = function(A) {
	A.add({
		body: {
			'margin-top': '20px',
			'padding': 0,
			'font-weight': 'bold',
			section: {
				'padding-top': '42px'
			},
			p: {
				'line-height': '30px'
			}
		}
	});
	A.add({
		'header .logo': {
			'font-size': '16px'
		}
	});
	A.import(__dirname + "/config/others.js");
}