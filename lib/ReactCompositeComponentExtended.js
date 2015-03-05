'use strict';

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var originalMountComponent = ReactCompositeComponent.Mixin.mountComponent;
ReactCompositeComponent.Mixin.mountComponent = function(rootID, transaction, context) {
  var instance = originalMountComponent.call(this, rootID, transaction, context);
  console.log('we can use this for the re-render:', this._instance);
  // add this to the correct inline media-queries
  return instance;
};