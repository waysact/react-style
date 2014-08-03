'use strict';

var esprima = require('esprima-fb');
var fs = require('fs');
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
      var ast = recast.parse(
        String(contents),
        {
          esprima: esprima
        }
      );

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


                var cssAst = property.value.body;
                //var replaceFolder = file;
                var cssCode = (Function('require', recast.print(cssAst).code.replace(/require\('/, 'require(\'./' + path.dirname(fileName) + '/')))(require);

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
            console.log('aaaa');
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
