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

function createStyleSheet(stylesheet, useClassName) {
  if (!useClassName) {
    // default
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
  create: createStyleSheet,
  compile: function(maxLength) {
    return stylesToCSS(styles, maxLength || 10);
  }
};

module.exports = StyleSheet;
