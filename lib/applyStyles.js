'use strict';

var CSSProperty = require('react/lib/CSSProperty');

var assign       = require("react/lib/Object.assign");
var isArray     = Array.isArray;

function applyStyle(props, style) {
  props.style = assign({}, props.style, style);
}

function applyStyles(props, styles) {
  if (isArray(styles)) {
    for (var i = 0, len = styles.length; i < len; i++) {
      applyStyles(props, styles[i]);
    }
  }
  else {
    return applyStyle(props, styles);
  }
}

module.exports = applyStyles;
