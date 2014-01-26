var Component = function(componentName, absurd, eventBus) {
	var api = {
		__name: componentName
	};
	var extend = lib.helpers.Extend;