'use strict';

var mergeInto = require('react/lib/merge');

function Style(style, className, children) {
  this.style = style;
  this.className = className;
  this.children = children;
}

module.exports = Style;
