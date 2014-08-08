'use strict';

var transformString = require('./transformString');
var autoprefixer = require('autoprefixer');

function loader(source) {
  this.cacheable();

  // fast path
  if (source.indexOf('ReactStyle') === -1) {
    return source;
  }

  var result = transformString(source, this.resource);
  if (result.css.length > 0) {
    var prefixedCSS = autoprefixer.process(result.css).css;
    this.addText(prefixedCSS);
  }
  return result.source;
}

module.exports = loader;
