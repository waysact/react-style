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
  var styleStyleKeys = Object.keys(styleStyle);
  if (style.isCompiled()) {
    if (!props.className) {
      props.className = '';
    }
    props.className += ' ' + style.className;
    if (propsStyle) {
      for (var i = 0, l = styleStyleKeys.length; i < l; i++) {
        var k = styleStyleKeys[i];
        if (propsStyle[k] != null) {
          propsStyle[k] = null;
          var complexOverride = COMPLEX_OVERRIDES[k];
          if (complexOverride) {
            var complexOverrideKeys = Object.keys(complexOverride);
            for (var j = 0, l2 = complexOverrideKeys.length; j < l2; j++) {
              var complexOverrideKey = complexOverrideKeys[j];
              if (propsStyle[complexOverrideKey] != null) {
                propsStyle[complexOverrideKey] = null;
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
    for (var i2 = 0, l3 = styleStyleKeys.length; i2 < l3; i2++) {
      var key = styleStyleKeys[i2];
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
