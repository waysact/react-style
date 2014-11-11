'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var isArray     = Array.isArray;

// TODO: Is this enough?
var COMPLEX_OVERRIDES = CSSProperty.shorthandPropertyExpansions;

function applyStyle(props, style) {
  if (style && style.isCompiled()) {
    if (!props.className) {
      props.className = '';
    }
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
  }
  else {
    if (!props.style) {
      props.style = {};
    }
    for (var key in style.style) {
      if (!style.style.hasOwnProperty(key)) {
        continue;
      }
      props.style[key] = style.style[key];
    }
  }
}

function applyStyles(props, styles) {
  if (isArray(styles)) {
    for (var i = 0, len = styles.length; i < len; i++) {
      applyStyles(props, styles[i]);
    }
  }
  else if (styles) {
    applyStyle(props, styles);
  }
}

module.exports = applyStyles;
