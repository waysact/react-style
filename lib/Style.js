'use strict';

function Style(style, className, children) {
  this.style = style;
  this.className = className;
  this.children = children;
}

Style.prototype.isCompiled = function() {
  var registry = window.__ReactStyle__;
  return registry && registry[this.className];
};

module.exports = Style;
