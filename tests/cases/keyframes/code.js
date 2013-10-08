module.exports = function(api) {
	api.add({
		keyframes: {
			name: "fade",
			frames: {
				"0%, 10%, 20%": {
					opacity: 0
				},
				"100%": {
					opacity: 1	
				}
			}
		}
	})
}