'use strict';

var React = require('react');
var merge = require('react/lib/merge');
var mergeInto = require('react/lib/mergeInto');
var toArray = require('react/lib/toArray');

var isArray = Array.isArray;
vat toString = Object.prototype.toString;

function isString(obj) {
  return toString.call(obj) === '[object String]';
}

Object.keys(React.DOM).forEach(function(tagName) {
  var factory = React.DOM[tagName];
  React.DOM[tagName] = function(props) {
    if (props.style) {
      if (isString(props.style)) {
        var props = merge({}, props);

        if (props.className) {
          props.className += ' ' + props.style;
        } else {
          props.className = props.style;
        }

        var args = toArray(arguments);
        args[0] = props;
        return factory.apply(factory, args);
      } else if (isArray(props.style)) {
        var props = merge({}, props);

        var style = {};
        var className = '';
        for (var i = 0, len = props.style.length; i < len; i++) {
          var item = props.style[i];
          if (isString(item)) {
            className += ' ' + item;
          } else {
            mergeInto(style, item);
          }
        }

        if (props.className) {
          props.className += ' ' + className;
          props.style = style;
        }

        var args = toArray(arguments);
        args[0] = props;
        return factory.apply(factory, args);
      }
    }
    return factory.apply(factory, arguments);
  };
});

function IntegratedStyle(func) {
  return func;
}

module.exports = IntegratedStyle;
