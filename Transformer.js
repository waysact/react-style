'use strict';

var fs = require('fs');
var recast = require('recast');
var glob = require('glob');
var css = require('css-builder')();
var Syntax = recast.Syntax;
var b = recast.types.builders;

var currCSSKey = 0;
var uniqueCSSKeys = {};
var allowedCSSClassNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var cssMapping = {};

function getUniqueCSSKey(fileName, className) {
  if (uniqueCSSKeys[fileName + className]) {
    return uniqueCSSKeys[fileName + className];
  }
  // TODO: do something smart

  return uniqueCSSKeys[fileName + className] = allowedCSSClassNameChars[currCSSKey++];
}

function addCSSClass(fileName, className, classBody) {
  cssMapping[getUniqueCSSKey(fileName, className)] = classBody;
}

function convertToCSS(cssJSON) {
  var classNames = Object.keys(cssJSON);

  for (var i = 0, l = classNames.length; i < l; i++) {
    var className = classNames[i];
    css.rule('.' + className, cssJSON[className]);
  }

  return css.toString();
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
      var fileName = file.name;
      var contents = file.contents;
      var ast = recast.parse(String(contents));

      recast.visit(ast, {

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
                var cssAst = property;
                var cssCode = (Function('return {' + recast.print(cssAst).code + '}'))();
                var classNames = Object.keys(cssCode.css);
                for (var j = 0, l2 = classNames.length; j < l2; j++) {
                  var className = classNames[j];
                  addCSSClass(fileName, className, cssCode.css[className]);
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
            if (node.parent.value.property) {
              var name = node.parent.value.property.name;
              node.parent.replace(b.literal(' ' + getUniqueCSSKey(fileName, name)));
            }
            return false;
          }

          this.traverse(node);
        }
      });

      transformations.files.push({
        name: fileName,
        contents: recast.print(ast).code
      })
    }

    transformations.css = convertToCSS(cssMapping);

    return transformations;
  }

};

module.exports = Transformer;
