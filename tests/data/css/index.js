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
				'line-height': '133px'
			}
		}
	});
	A.add({
		'header .logo a': {
			'font-size': '24px',
			'padding-top': '23px',
			span: {
				'font-weight': 'bold'
			}
		}
	});
	// A.import(__dirname + "/config/jjj.js");
}