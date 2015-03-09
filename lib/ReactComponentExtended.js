'use strict';

var helperObj = {};

var ReactComponent = require('react/lib/ReactComponent');
var originalMountComponent = ReactComponent.mountComponent;
ReactComponent.mountComponent = function(rootID, transaction, context) {
  var originalCall = originalMountComponent.call(this, rootID, transaction, context);
  var instance = this._instance;
  var props = instance.props;
  if (props && props.styles) {
    helperObj.associateToMediaQuery(instance);
  }
  return originalCall;
};

module.exports = helperObj;
