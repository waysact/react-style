'use strict';

if (typeof __webpack_require__ !== 'undefined') {
  var cache = __webpack_require__.c;
  var cacheKeys = Object.keys(cache);
  for (var i = 0, l = cacheKeys.length; i < l; i++) {
    var cacheKey = cacheKeys[i];
    var cacheValue = cache[cacheKey];
    var exports = cacheValue.exports;
    // we need something better
    if (cacheValue.loaded && exports.render && exports.createElement) {
      console.debug('Please load React Style before loading React.');
    }
  }
}

require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var assign                 = require("react/lib/Object.assign");

var Style                  = require('./Style');
var genUniqueCSSClassName  = require('./generateUniqueCSSClassName');
var stylesToCSS            = require('./stylesToCSS');

var isArray = Array.isArray;

var styles        = [];
var captureStyles = true;
var counter       = 0;

if ("production" !== process.env.NODE_ENV) {
  if (!console.debug) {
    console.debug = console.log;
  }
  console.debug('You are running React Style inside development mode.');
}

function createStyle(props, className) {
  var uniqueClassNameIdentifier = genUniqueCSSClassName('' + counter++);
  if ("production" !== process.env.NODE_ENV) {
    className = (className || 'c') + '_' + uniqueClassNameIdentifier;
    for (var propKey in props) {
      if (typeof props[propKey] === 'string' &&
        props[propKey].indexOf('!important') > 0) {
        console.warn('You are using !important inside ' +
                     className + '. React Style discourages this due to the ' +
                     'effect it has on CSS specificity and therefore breaks ' +
                     'the require-tree ordering that React Style uses.');
      }
    }

  }
  else {
    className = uniqueClassNameIdentifier;
  }

  var style = {};

  var propKeys = Object.keys(props);
  for (var i = 0, l = propKeys.length; i < l; i++) {
    var key = propKeys[i];
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
