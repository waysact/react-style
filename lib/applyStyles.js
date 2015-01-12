'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var isArray     = Array.isArray;

// TODO: Is this enough?
var COMPLEX_OVERRIDES = CSSProperty.shorthandPropertyExpansions;


function applyStyle(props, style, order) {
  if (style === null || style === undefined || style === false) {
    return order;
  }
  else if (typeof style === 'string' && order < 10) {
    // classes
    if (!props.className) {
      props.className = '';
    }
    for (var j = 0; j < order + 1; j++) {
      props.className += ' ' + style + (j === 0 ? '' : j);
    }

    return order + 1;
  }
  else {
    if (!props.style) {
      props.style = {};
    }
    for (var key in style) {
      if (!style.hasOwnProperty(key)) {
        continue;
      }
      props.style[key] = style[key];
      if (COMPLEX_OVERRIDES[key]) {
        for (var override in COMPLEX_OVERRIDES[key]) {
          props.style[override] = null;
        }
      }
    }

    return order;
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
