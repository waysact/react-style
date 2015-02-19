'use strict';

require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var stylesToCSS            = require('./stylesToCSS');
var styleComponent         = require('./styleComponent');
var assign                 = require("react/lib/Object.assign");
var isArray                = Array.isArray;

var styles = [];
var counter = 0;

function genClassName() {
  counter += 1;
  return 'c' + counter + '_';
}

function createStyle(props, className) {
  className = className || genClassName();

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
    // export to separate CSS classes
    var styleSheetStyles = Object.keys(stylesheet);
    var results = {};
    for (var i = 0, l = styleSheetStyles.length; i < l; i++) {
      var styleName = styleSheetStyles[i];
      var style = stylesheet[styleName];
      results[styleName] = createStyle(style, styleName);
    }
    return results;
  }
}

var ReactStyle = {
  create: createStyleSheet,
  style: styleComponent,
  compile: function(maxLength) {
    return stylesToCSS(styles, maxLength || 10);
  }
};

assign(createStyle, ReactStyle);

module.exports = createStyle;
