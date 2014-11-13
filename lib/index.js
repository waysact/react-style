'use strict';

require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var assign                 = require("react/lib/Object.assign");

var Style                  = require('./Style');
var genUniqueCSSClassName  = require('./generateUniqueCSSClassName');
var stylesToCSS            = require('./stylesToCSS');
var styleComponent         = require('./styleComponent');

var isArray = Array.isArray;

var styles        = [];
var captureStyles = true;
var counter       = 0;

function createStyle(props, className) {
  var uniqueClassNameIdentifier = genUniqueCSSClassName('' + counter++);
  if ("production" !== process.env.NODE_ENV) {
    className = className + '_' + uniqueClassNameIdentifier;
  }
  else {
    className = uniqueClassNameIdentifier;
  }

  var children = {};
  var style = {};

  for (var key in props) {
    if (!props.hasOwnProperty(key)) {
      continue;
    }

    var value = props[key];
    if (
      typeof value === 'object' &&
      !isArray(value) &&
      (!value || typeof value.toCSS !== 'function')
    ) {
      if (value instanceof Style) {
        children[key] = value;
      } else {
        children[key] = ReactStyle.create(
          value,
          className ? className + '__' + key : null);
      }
    } else {
      style[key] = props[key];
    }
  }

  var styleDecl = new Style(style, className, children);
  if (captureStyles) {
    styles.push(styleDecl);
  }
  return styleDecl;
}


var ReactStyle = {

  create: createStyle,
  style: styleComponent,

  compile: function() {
    return stylesToCSS(styles);
  },

  inject: function() {
    captureStyles = false;
    if (!ExecutionEnvironment.canUseDOM ||
      window.__ReactStyle__ !== undefined) {
      // We are in Node or Styles are already injected
      return;
    }
    var tag = document.createElement('style');
    var compiled = this.compile();
    tag.innerHTML = compiled.css;
    window.__ReactStyle__ = compiled.classNames;
    document.getElementsByTagName('head')[0].appendChild(tag);
  }
};

assign(createStyle, ReactStyle);

module.exports = createStyle;
