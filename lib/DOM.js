'use strict';

var React                     = require('react');
var ReactDescriptor           = require('react/lib/ReactDescriptor');
var ReactDescriptorValidator  = require('react/lib/ReactDescriptorValidator');
var CSSProperty               = require('react/lib/CSSProperty');
var merge                     = require('react/lib/merge');
var mergeInto                 = require('react/lib/mergeInto');
var invariant                 = require('react/lib/invariant');
var isArray                   = Array.isArray;

// TODO: Is this enough?
var COMPLEX_OVERRIDES = CSSProperty.shorthandPropertyExpansions;

function applyStyle(props, style) {
  if (style === null || style === undefined || style === false) {
    return;
  } else if (style.isCompiled()) {
    props.className += ' ' + style.className;
    if (props.style) {
      for (var k in style.style) {
        if (props.style[k] !== null || props.style[k] !== undefined) {
          props.style[k] = null;
          var complexOverride = COMPLEX_OVERRIDES[k];
          if (complexOverride) {
            for (k in complexOverride) {
              if (props.style[k] !== null || props.style[k] !== undefined) {
                props.style[k] = null;
              }
            }
          }
        }
      }
    }
  } else {
    if (!props.style) {
      props.style = {};
    }
    mergeInto(props.style, style.style);
  }
}

function applyStyles(props, styles) {
  if (Array.isArray(styles)) {
    for (var i = 0, len = styles.length; i < len; i++) {
      applyStyles(props, styles[i]);
    }
  } else {
    applyStyle(props, styles);
  }
}

function buildProps(props) {
  var builtProps = {
    className: props.className || '',
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
    if (descriptor.props.styles) {
      mergeInto(descriptor.props, buildProps(descriptor.props));
    }
    this.construct(descriptor);
  };

  Constructor.displayName = tag;
  Constructor.prototype = Object.create(PrevConstructor.prototype);
  Constructor.prototype.constructor = Constructor;

  Constructor.prototype.performUpdateIfNecessary = function(transaction) {
    var descriptor = this._pendingDescriptor;
    if (descriptor.props.styles) {
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

module.exports = DOM;
