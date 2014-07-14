module.exports = function(A) {
	A.import(__dirname + '/config/colors.js');
	A.import(__dirname + '/config/sizes.js');
	A.import([
		__dirname + '/config/A.js',
		__dirname + '/config/B.js'
	]);

}