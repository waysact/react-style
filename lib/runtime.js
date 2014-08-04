'use strict';

var RCSS = require('rcss');

function wrapCSSGenerator(func) {
  return function() {
    var style = func.apply(this, arguments);
    return RCSS.registerClass(style).className;
  }
}

module.exports = {
  wrapCSSGenerator: wrapCSSGenerator
};
