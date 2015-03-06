'use strict';

var helperObj = {};

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var originalMountComponent = ReactCompositeComponent.Mixin.mountComponent;
ReactCompositeComponent.Mixin.mountComponent = function(rootID, transaction, context) {
  var originalCall = originalMountComponent.call(this, rootID, transaction, context);
  var instance = this._instance;
  var props = instance.props;
  if (props && props.styles) {
    helperObj.associateToMediaQuery(instance);
  }
  return originalCall;
};

module.exports = helperObj;
