var Component = function(componentName, absurd, eventBus, cls) {
	var api = lib.helpers.Extend({
		__name: componentName
	}, cls);
	var extend = lib.helpers.Extend;