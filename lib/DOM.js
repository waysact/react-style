'use strict';

var React                     = require('react');
var ReactPropTransferer       = require('react/lib/ReactPropTransferer');
var ReactDescriptor           = require('react/lib/ReactDescriptor');
var ReactDescriptorValidator  = require('react/lib/ReactDescriptorValidator');
var merge                     = require('react/lib/merge');
var mergeInto                 = require('react/lib/mergeInto');
var applyStyles               = require('./applyStyles');

function buildProps(props) {
  var builtProps = {
    className: props.className || null,
    style: props.style ? merge(props.style) : null,
    styles: undefined
  };
  applyStyles(builtProps, props.styles);
  return builtProps;
}

var DOM = {};

Object.keys(React.DOM).forEach(function(tag) {
  var PrevConstructor = React.DOM[tag].type;

  // React.DOM exports not only components
  if (PrevConstructor === undefined) {
    return;
  }

  var Constructor = function(descriptor) {
    if (descriptor && descriptor.props && descriptor.props.styles) {
      mergeInto(descriptor.props, buildProps(descriptor.props));
    }
    this.construct(descriptor);
  };

  Constructor.displayName = tag;
  Constructor.prototype = Object.create(PrevConstructor.prototype);
  Constructor.prototype.constructor = Constructor;

  Constructor.prototype.performUpdateIfNecessary = function(transaction) {
    var descriptor = this._pendingDescriptor;
    if (descriptor && descriptor.props && descriptor.props.styles) {
      var update = buildProps(descriptor.props);
      mergeInto(descriptor.props, update);
    }
    return PrevConstructor.prototype.performUpdateIfNecessary.call(
      this, transaction);
  };

  var ConvenienceConstructor = ReactDescriptor.createFactory(Constructor);

  if ("production" !== process.env.NODE_ENV) {
    ConvenienceConstructor = ReactDescriptorValidator.createFactory(
      ConvenienceConstructor
    );
  }

  DOM[tag] = ConvenienceConstructor;
});

/**
 * We define transfer strategy for styles prop as concat operation.
 */
ReactPropTransferer.TransferStrategies.styles = function(props, key, value) {
  if (!props.hasOwnProperty(key)) {
    props[key] = value;
  } else {
    props[key] = [].concat(props[key], value);
  }
};

module.exports = DOM;
