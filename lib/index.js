'use strict';

require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var Style                  = require('./Style');
var stylesToCSS            = require('./stylesToCSS');
var styleComponent         = require('./styleComponent');

var assign                 = require("react/lib/Object.assign");

var isArray = Array.isArray;


var styles = [];
var captureStyles = true;
var counter = 0;

function genClassName() {
  counter += 1;
  return 'c' + counter + '_';
}

function createStyle(props, className) {
  className = className || genClassName();

  var style = {};

  for (var key in props) {
    if (!props.hasOwnProperty(key)) {
      continue;
    }

    style[key] = props[key];
  }

  var styleDecl = new Style(style, className);
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
  }

};

assign(createStyle, ReactStyle);

module.exports = createStyle;
