'use strict';

var esprima = require('esprima-fb');
var vm = require('vm');
var fs = require('fs');
var freeVariables = require('free-variables');
var recast = require('recast');
var glob = require('glob');
var path = require('path');
var css = require('css-builder')();
var Syntax = recast.Syntax;
var b = recast.types.builders;

var currCSSKey = 0;
var uniqueCSSKeys = {};
var allowedCSSClassNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var cssMapping = {};

function getUniqueCSSKey(fileName, className) {
  if (uniqueCSSKeys[fileName + className]) {
    return uniqueCSSKeys[fileName + className];
  }

  var key1pos = Math.floor(currCSSKey / (allowedCSSClassNameChars.length * allowedCSSClassNameChars.length));
  var key1 = allowedCSSClassNameChars[key1pos - 1];
  var key2pos = Math.floor((currCSSKey - (key1 ? key1pos * (allowedCSSClassNameChars.length * allowedCSSClassNameChars.length) : 0)) / allowedCSSClassNameChars.length);
  var key2 = allowedCSSClassNameChars[key2pos - 1];
  var key3 = allowedCSSClassNameChars[(currCSSKey - (key1 ? (key1pos * allowedCSSClassNameChars.length * allowedCSSClassNameChars.length) : 0) - (key2? key2pos * allowedCSSClassNameChars.length:0))];
  var key = '';
  if (key1) key += key1;
  if (key2) key += key2;
  if (key3) key += key3;
  currCSSKey++;

  return uniqueCSSKeys[fileName + className] = key;
}

function addCSSClass(fileName, className, classBody) {
  var classSplit = className.split(':');
  var name = classSplit[0];
  var pseudo;
  if (classSplit.length > 1) {
    pseudo = classSplit[1];
  }
  cssMapping[getUniqueCSSKey(fileName, name) + (pseudo ? ':' + pseudo : '')] = {
    classBody: classBody
  };
}

function convertToCSS(cssJSON) {
  var classNames = Object.keys(cssJSON);

  for (var i = 0, l = classNames.length; i < l; i++) {
    var className = classNames[i];
    var pseudo = cssJSON[className].pseudo;
    css.rule('.' + className + (pseudo ? (':'+pseudo) : ''), cssJSON[className].classBody);
  }

  return css.toString();
}

function transform(fileName, contents) {
  var ast = recast.parse(
    String(contents),
    {
      esprima: esprima
    }
  );

  var requires = {};

  recast.visit(ast, {

    // Find all `var <id> = require(<module>)` so we can provide them for
    // style generation if needed.
    //
    // It is not correct 100% of times (some edge cases are missing) but
    // with es6 import declarations this task would be much simpler.
    visitCallExpression: function(node) {
      if (node.value.callee.type === 'Identifier'
          && node.value.callee.name === 'require'
          && node.parentPath.value.type === 'VariableDeclarator'
          && node.parentPath.value.id.type === 'Identifier') {
        requires[node.parentPath.value.id.name] = {
          ast: node.value,
          path: node,
          counter: 0
        };
      }
      this.traverse(node)
    },

    visitIdentifier: function(node) {
      // TODO: do a proper scope analysis with escope, otherwise if can leave
      // some unused imports
      if (node.parentPath !== 'MemberExpression' && requires[node.value.name]) {
        requires[node.value.name].counter += 1;
      }
      this.traverse(node);
    },

    visitObjectExpression: function(node) {
      var props = [];
      for (var i = 0, l = node.value.properties.length; i < l; i++) {
        var property = node.value.properties[i];

        /**
          * here we remove the CSS block and store it for future usage
          */
        if (property.key.name === 'css') {
          if(node.parentPath.parentPath.value.callee.type === 'MemberExpression' &&
            node.parentPath.parentPath.value.callee.property.name === 'createClass') {


            var cssAst = property.value.body;
            var cssSrc = recast.print(cssAst).code;

            var freeVars = freeVariables(cssAst);
            if (freeVars.length > 0) {
              freeVars.forEach(function(v) {
                if (requires[v]) {
                  cssSrc = 'var ' + v + ' = ' + recast.print(requires[v].ast).code + '\n' + cssSrc;
                }
              });
            }
            var cssSrc = 'var __result__ = (function() {' + cssSrc + '})();'
            var sandbox = {
              require: function(mod) {
                return require('./' + path.join(path.dirname(fileName), mod));
              }
            };
            vm.runInNewContext(cssSrc, sandbox, __filename);
            var cssCode = sandbox.__result__;

            var classNames = Object.keys(cssCode);
            for (var j = 0, l2 = classNames.length; j < l2; j++) {
              var className = classNames[j];
              addCSSClass(fileName, className, cssCode[className]);
            }
          }
          else {
            var cssClassName;
            this.traverse(node, {
              visit: function(a) {
                if (a.value[0].value && a.value[0].value.property) {
                  cssClassName = a.value[0].value.property.name;
                }
              }
            });
            if (cssClassName) {
              props.push(b.property('init', b.identifier('css'), b.literal(' ' + getUniqueCSSKey(fileName, cssClassName))));
            }
            else {
              props.push(property);
            }
          }
        }
        else {
          props.push(property);
        }
      }

      return b.objectExpression(props);
    },

    visitMemberExpression: function(node) {
      if (node.value.object.name === 'css') {
        return b.literal(' ' + getUniqueCSSKey(fileName, node.value.property.name));
      }
      else if (node.value.property.name === 'css') {
        //console.log(node.parent.parent.value.property);
        if (node.parent.parent.value.property) {
          var name = node.parent.parent.value.property.name;
          node.parent.parent.replace(b.literal(' ' + getUniqueCSSKey(fileName, name)));
        }
        return false;
      }
      else if(node.value.object.callee &&
        node.value.object.callee.name === 'css'){
        var name = node.value.property.name;
        node.replace(b.literal(' ' + getUniqueCSSKey(fileName, name)));
      }

      this.traverse(node);
    }
  });

  // remove each require() which didn't see usage from the outside of css()
  // functions
  Object.keys(requires).forEach(function(mod) {
    if (requires[mod].counter === 0) {
      var declarationPath = requires[mod].path.parentPath.parentPath;
      var declaratorPath = requires[mod].path.parentPath;
      declarationPath.value.splice(declaratorPath.name, 1);
      if (declarationPath.value.length === 0) {
        declarationPath.parentPath.parentPath.value.splice(
          declarationPath.parentPath.name,
          1
        );
      }
    }
  });

  return {
    name: fileName,
    contents: recast.print(ast).code
  };
}

var Transformer = { // master in disguise

  transformFiles: function(files) {
    // TODO: validate input

    var transformations = {
      css: '',
      files: [
      ]
    };

    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i];
      transformations.files.push(transform(file.name, file.contents));
    }

    transformations.css = convertToCSS(cssMapping);

    return transformations;
  }

};

module.exports = Transformer;
