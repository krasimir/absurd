module.exports = function(value) {
	value = value.toString().replace(/\/ /g, '/').split('/');
	return value;
}