'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var mergeInto   = require('react/lib/mergeInto');
var isArray       = Array.isArray;

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
  if (isArray(styles)) {
    for (var i = 0, len = styles.length; i < len; i++) {
      applyStyles(props, styles[i]);
    }
  } else {
    applyStyle(props, styles);
  }
}

module.exports = applyStyles;
