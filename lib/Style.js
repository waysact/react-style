'use strict';

function Style(style, className) {
  this.style = style;
  this.className = className;
}

Style.prototype.isCompiled = function() {
  var registry = window.__ReactStyle__;
  return registry && registry[this.className];
};

module.exports = Style;
