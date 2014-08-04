'use strict';

var React = require('react');
var merge = require('react/lib/merge');
var mergeInto = require('react/lib/mergeInto');
var toArray = require('react/lib/toArray');

var isArray = Array.isArray;

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

Object.keys(React.DOM).forEach(function(tagName) {
  var factory = React.DOM[tagName];
  React.DOM[tagName] = function(props) {
    if (props.style) {
      var args;
      var updatedProps;
      if (isString(props.style)) {
        updatedProps = merge({}, props);

        if (updatedProps.className) {
          updatedProps.className += ' ' + updatedProps.style;
        } else {
          updatedProps.className = updatedProps.style;
        }

        args = toArray(arguments);
        args[0] = updatedProps;
        return factory.apply(factory, args);
      } else if (isArray(props.style)) {
        updatedProps = merge({}, props);

        var style = {};
        var className = '';
        for (var i = 0, len = updatedProps.style.length; i < len; i++) {
          var item = updatedProps.style[i];
          if (isString(item)) {
            className += ' ' + item;
          } else {
            mergeInto(style, item);
          }
        }

        if (updatedProps.className) {
          updatedProps.className += ' ' + className;
          updatedProps.style = style;
        }

        args = toArray(arguments);
        args[0] = updatedProps;
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
