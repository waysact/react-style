'use strict';

require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var Style                  = require('./Style');
var stylesToCSS            = require('./stylesToCSS');
var styleComponent         = require('./styleComponent');
var styleComponentChildren = require('./styleComponentChildren');

var assign                 = require("react/lib/Object.assign");

var isArray = Array.isArray;


var styles = {};
var captureStyles = true;
var counter = 0;

function genClassName() {
  counter += 1;
  return 'c' + counter + '_';
}

function createStyle(props, className) {
  // This is webpack specific - would be nice if we could make it friendly for
  // others (like Browserify)
  //
  // Also wonder how easy this could break :/
  var keys = Object.keys(__webpack_require__.c);
  var currentModuleId;
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    if (!__webpack_require__.c[key].loaded) {
      currentModuleId = key;
    }
  }
  console.log(currentModuleId);

  className = className || genClassName();

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
    if (!styles[currentModuleId]) {
      styles[currentModuleId] = [];
    }
    styles[currentModuleId].push(styleDecl);
  }
  return styleDecl;
}


var ReactStyle = {

  create: createStyle,
  style: styleComponent,
  styleChildren: styleComponentChildren,

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
