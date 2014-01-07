function fireEvent(node, eventName) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, true, false);
  node.dispatchEvent(event);
};