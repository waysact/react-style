'use strict';

var fs = require('fs');
var recast = require('recast');
var glob = require('glob');
var Syntax = recast.Syntax;
var b = recast.types.builders;

var currCSSKey = 0;
var uniqueCSSKeys = {};
var allowedCSSClassNameChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function getUniqueCSSKey(className) {
  if (uniqueCSSKeys[className]) {
    return uniqueCSSKeys[className];
  }
  return uniqueCSSKeys[className] = allowedCSSClassNameChars[currCSSKey++];
}

function addCSSClass(className, classBody) {
  cssMapping[getUniqueCSSKey(className)] = classBody;
}

function writeCSS() {

}

var cssMapping = {

};

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
                var css = (Function('return {' + recast.print(cssAst).code + '}'))();
                var classNames = Object.keys(css.css);
                for (var j = 0, l2 = classNames.length; j < l2; j++) {
                  var className = classNames[j];
                  addCSSClass(className, css.css[className]);
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
                  props.push(b.property('init', b.identifier('css'), b.literal(' ' + getUniqueCSSKey(cssClassName))));
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

        visitAssignmentExpression: function(node) {
          if (node.value.right.object){
            if(node.value.right.object.property && node.value.right.object.property.name === 'css') {
              var cssClassName;
              this.traverse(node, {
                visit: function(b) {
                  if (b.value.type === 'MemberExpression') {
                    cssClassName = b.value.property.name;
                  }
                }
              });
              if (cssClassName) {
                return b.assignmentExpression(node.value.operator, node.value.left, b.literal(' ' + getUniqueCSSKey(cssClassName)));
              }
            }
            else if (node.value.right.object.name === 'css') {
              return b.assignmentExpression(node.value.operator, node.value.left, b.literal(' ' + getUniqueCSSKey(node.value.right.property.name)));
            }
          }
          this.traverse(node);
        },

        visitVariableDeclarator: function(node) {
          if (node.value.init.type === 'MemberExpression'){
            if(node.value.init.object.property &&
              node.value.init.object.property.name === 'css') {
              var cssClassName = '';
              this.traverse(node, {
                visit: function(z) {
                  if (z.value.type === 'MemberExpression') {
                    cssClassName = z.value.property.name;
                  }
                }
              });
              return b.variableDeclarator(node.value.id, b.literal(' ' + getUniqueCSSKey(cssClassName)));
            }
            else if (node.value.init.object.name === 'css') {
              return b.variableDeclarator(node.value.id, b.literal(' ' + getUniqueCSSKey(node.value.init.property.name)));
            }
          }
          this.traverse(node);
        }
      });

      transformations.files.push({
        name: fileName,
        contents: recast.print(ast).code
      })
    }

    transformations.css = cssMapping;

    return transformations;
  }

};

module.exports = Transformer;
