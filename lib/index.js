'use strict';

var React     = require('react');
var merge     = require('react/lib/merge');
var mergeInto = require('react/lib/mergeInto');
var toArray   = require('react/lib/toArray');

var isArray = Array.isArray;

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

/**
 * Monkey-patch React.DOM.* to handle `styles` prop.
 *
 *  styles="className"
 *  styles={{backgroundColor: 'red'}}
 *  styles=["className", {backgroundColor: 'red'}]
 *
 */
Object.keys(React.DOM).forEach(function(tagName) {
  var factory = React.DOM[tagName];
  React.DOM[tagName] = function(props) {
    if (props.styles) {
      var styles = props.styles;

      var updatedProps = merge({}, props);
      delete updatedProps.styles;

      if (isString(styles)) {
        if (updatedProps.className) {
          updatedProps.className += ' ' + styles;
        } else {
          updatedProps.className = style;
        }
      } else if (isArray(styles)) {
        var style = {};
        var className = '';

        for (var i = 0, len = styles.length; i < len; i++) {
          var item = styles[i];
          if (isString(item)) {
            className += ' ' + item;
          } else if (item === false || item === null || item === undefined) {
            // do nothing
          } else {
            mergeInto(style, item);
          }
        }

        if (updatedProps.className) {
          updatedProps.className += ' ' + className;
        } else {
          updatedProps.className = className;
        }

        if (updatedProps.style) {
          updatedProps.style = merge(updatedProps.style, style);
        } else {
          updatedProps.style = style;
        }
      }

      var args = toArray(arguments);
      args[0] = updatedProps;
      return factory.apply(factory, args);
    }

    return factory.apply(factory, arguments);
  };
});

/**
 * Used as a marker for transformation.
 */
function IntegratedStyle(func) {
  return func;
}

module.exports = IntegratedStyle;
