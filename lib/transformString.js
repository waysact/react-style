'use strict';

var esprima             = require('esprima-fb');
var recast              = require('recast');
var transform           = require('./transform');
var compileStylesToCSS  = require('./compileStylesToCSS');

function transformString(source, filename) {
  var ast = recast.parse(source, {esprima: esprima});
  var result = transform(ast, filename);
  return {
    css: compileStylesToCSS(result.styles),
    source: recast.print(ast).code,
  };
}

module.exports = transformString;
