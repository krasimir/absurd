module.exports = function(api) {
	api.add({
		header: {
			fontSize: '20px',
			'@media print': {
				fontSize: '30px'
			}
		}
	})
}