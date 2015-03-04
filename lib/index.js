'use strict';

var ReactElementExtended = require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var stylesToCSS            = require('./stylesToCSS');
var assign                 = require("react/lib/Object.assign");
var isArray                = Array.isArray;
var generateUniqueCSSClassName = require('./generateUniqueCSSClassName');

var styles = [];

function createStyle(props, className) {
  styles.push({
    style: props,
    className: className
  });

  return className;
}

function applyMediaQueries(stylesheet) {
  var styles = Object.keys(stylesheet);
  for (var i = 0, l = styles.length; i < l; i++) {
    var styleName = styles[i];
    var style = stylesheet[styleName];
    if (styleName.indexOf('@media') === 0) {
      var mediaQuery = styleName.substr('@media '.length);
      if (window.matchMedia(mediaQuery).matches) {
        var props = Object.keys(style);
        for (var j = 0, l2 = props.length; j < l2; j++) {
          var prop = props[j];
          assign(stylesheet[prop], style[prop]);
        }


      }
    }
  }

}

function createStyleSheet(stylesheet, useClassName) {
  if (!useClassName) {
    // default
    applyMediaQueries(stylesheet);
    return stylesheet;
  }
  else {
    ReactElementExtended.maxOverridesLength = StyleSheet.maxOverridesLength;

    // export to separate CSS classes
    var styleSheetStyles = Object.keys(stylesheet);
    var results = {};
    for (var i = 0, l = styleSheetStyles.length; i < l; i++) {
      var styleName = styleSheetStyles[i];
      var style = stylesheet[styleName];
      var uniqueKey = generateUniqueCSSClassName('', styleName);
      if ("production" !== process.env.NODE_ENV) {
        uniqueKey = styleName + '_' + uniqueKey;
      }

      results[styleName] = createStyle(style, uniqueKey);
    }
    return results;
  }

}

var StyleSheet = {
  compile: function(maxLength) {
    return stylesToCSS(styles, maxLength || 10);
  },
  create: createStyleSheet
};

module.exports = StyleSheet;
