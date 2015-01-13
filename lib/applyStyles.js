'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var isArray     = Array.isArray;
var keys        = Object.keys;

var COMPLEX_OVERRIDES = CSSProperty.shorthandPropertyExpansions;

function applyClassName(props, className, order) {
  if (!props.className) {
    props.className = '';
  }
  for (var j = 0; j < order + 1; j++) {
    props.className += ' ' + className + (j === 0 ? '' : j);
  }

  return order + 1;
}

function applyInlineStyle(props, style, order) {
  if (!props.style) {
    props.style = {};
  }
  var styleKeys = keys(style);
  for (var i = 0, l = styleKeys.length; i < l; i++) {
    var key = styleKeys[i];
    props.style[key] = style[key];

    if (COMPLEX_OVERRIDES[key]) {
      for (var override in COMPLEX_OVERRIDES[key]) {
        props.style[override] = '';
      }
    }
  }

  return order;
}

function applyStyle(props, style, order) {
  if (style === null || style === undefined || style === false) {
    return order;
  }
  else if (typeof style === 'string' && order < 10) {
    return applyClassName(props, style, order);
  }
  else {
    return applyInlineStyle(props, style, order);
  }
}

function applyStyles(props, styles, order) {
  if (order === undefined) {
    order = 0;
  }
  if (isArray(styles)) {
    for (var i = 0, len = styles.length; i < len; i++) {
      var style = styles[i];
      order = applyStyles(props, style, order);
    }
    return order;
  }
  else {
    return applyStyle(props, styles, order);
  }
}

module.exports = applyStyles;
