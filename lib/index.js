'use strict';

var copyProperties         = require('react/lib/copyProperties');
var ReactInjection         = require('react/lib/ReactInjection');
var DOM                    = require('./DOM');
var Style                  = require('./Style');
var stylesToCSS            = require('./stylesToCSS');
var styleComponent         = require('./styleComponent');
var styleComponentChildren = require('./styleComponentChildren');

ReactInjection.DOM.injectComponentClasses(DOM);

var styles = [];
var captureStyles = true;
var counter = 0;

function genClassName() {
  counter += 1;
  return 'c' + counter + '_';
}

function createStyle(props, className) {
  className = className || genClassName();

  var children = {};
  var style = {};

  for (var key in props) {
    if (!props.hasOwnProperty(key)) {
      continue;
    }

    var value = props[key];
    if (typeof value === 'object') {
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
  styleChildren: styleComponentChildren,

  compile: function() {
    return stylesToCSS(styles);
  },

  inject: function() {
    captureStyles = false;
    if (window.__ReactStyle__ !== undefined) {
      // Styles are already injected
      return;
    }
    var tag = document.createElement('style');
    var compiled = this.compile();
    tag.innerHTML = compiled.css;
    window.__ReactStyle__ = compiled.classNames;
    document.getElementsByTagName('head')[0].appendChild(tag);
  }
};

copyProperties(createStyle, ReactStyle);

module.exports = createStyle;
