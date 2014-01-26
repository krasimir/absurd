api.wire = function(event) {
	absurd.components.events.on(event, this[event] || function() {}, this);
	return this;
};