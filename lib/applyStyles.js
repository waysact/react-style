'use strict';

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
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
    var start = -1;
    var beforeClassName = '';
    for (var i = 0, len = styles.length; i < len; i++) {
      var style = styles[i];
      if (!style) {
        continue;
      }
      var styleClassName = style.className;
      if ("production" !== process.env.NODE_ENV &&
          ExecutionEnvironment.canUseDOM &&
          window.__ReactStyle__ !== undefined) {
        var stylePosition = window.__ReactStyle__[styleClassName];
        if (start > -1 && stylePosition < start) {
          console.warn('You are using ' + styleClassName + ' after ' +
                       beforeClassName + ', while you initialized the former' +
                       ' after the latter. As React Style is dependent upon ' +
                       'the initialization order this might result in ' +
                       'wrongly applied styling. Solve this by placing ' +
                       'the creation of ' + styleClassName +  ' below ' +
                       beforeClassName + '.');
        }
        start = stylePosition;
        beforeClassName = styleClassName;
      }
      applyStyles(props, style);
    }
  }
  else if (styles) {
    applyStyle(props, styles);
  }
}

module.exports = applyStyles;
