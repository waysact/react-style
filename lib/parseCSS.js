'use strict';

var reworkParse = require('css/lib/parse');

var replaceRegexp = /-([a-z])/g;


function parseCSS(props) {
  var cssAST = reworkParse('.temp { ' + String(props) + '}');
  var declarations = cssAST.stylesheet.rules[0].declarations;
  var newProps = {};
  for (var i = 0, l = declarations.length; i < l; i++) {
    var declaration = declarations[i];
    var propName = declaration.property.replace(
      replaceRegexp,
      function(a, character) {
        return character.toUpperCase();
    });
    newProps[propName] = declaration.value;
  }
  return newProps;
}

module.exports = parseCSS;
