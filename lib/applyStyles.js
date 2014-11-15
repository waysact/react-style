'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var isArray     = Array.isArray;

// TODO: Is this enough?
var COMPLEX_OVERRIDES = CSSProperty.shorthandPropertyExpansions;

function applyStyle(props, style) {
  if (!style) {
    return;
  }

  var propsStyle = props.style;
  var styleStyle = style.style;

  if (style && style.isCompiled()) {
    if (!props.className) {
      props.className = '';
    }
    props.className += ' ' + style.className;
    if (propsStyle) {
      for (var k in styleStyle) {
        if (propsStyle[k] != null) {
          propsStyle[k] = null;
          var complexOverride = COMPLEX_OVERRIDES[k];
          if (complexOverride) {
            for (k in complexOverride) {
              if (propsStyle[k] != null) {
                propsStyle[k] = null;
              }
            }
          }
        }
      }
    }
  }
  else {
    if (!propsStyle) {
      propsStyle = props.style = {};
    }
    for (var key in style.style) {
      if (!style.style.hasOwnProperty(key)) {
        continue;
      }
      propsStyle[key] = styleStyle[key];
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
