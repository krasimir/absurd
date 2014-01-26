var	appended = false
api.__append = function(next) {
	if(!appended && this.el && this.get("parent")) {
		appended = true;
		this.get("parent").appendChild(this.el);
	}
	next();
	return this;
}