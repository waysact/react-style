'use strict';

var esprima = require('esprima-fb');
var freeVariables = require('free-variables');
var path = require('path');
var recast = require('recast');
var vm = require('vm');

var b = recast.types.builders;

var addCSSClass = require('./addCSSClass');
var convertJSONToCSS = require('./convertJSONToCSS');
var cssMapping = {};
var getUniqueCSSKey = require('./getUniqueCSSKey');

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
      var callee = node.value.callee;
      var parentValue = node.parentPath.value;
      if (callee.type === 'Identifier' &&
          callee.name === 'require' &&
          parentValue.type === 'VariableDeclarator' &&
          parentValue.id.type === 'Identifier') {
        requires[parentValue.id.name] = {
          ast: node.value,
          path: node,
          counter: 0
        };
      }
      this.traverse(node);
    },

    visitIdentifier: function(node) {
      // TODO: do a proper scope analysis with escope, otherwise it can leave
      // some unused imports
      if (node.parentPath !== 'MemberExpression' && requires[node.value.name]) {
        requires[node.value.name].counter += 1;
      }
      this.traverse(node);
    },

    visitObjectExpression: function(node) {
      var props = [];
      var properties = node.value.properties;
      for (var i = 0, l = properties.length; i < l; i++) {
        var property = properties[i];

        /**
          * here we remove the CSS block and store it for future usage
          */
        if (property.key.name === 'css') {
          var callee = node.parentPath.parentPath.value.callee;

          // simple way of checking if it's a React component by
          // looking for createClass
          if (callee.type === 'MemberExpression' &&
              callee.property.name === 'createClass') {

            var cssAST = property.value.body;
            var cssSrc = recast.print(cssAST).code;

            var freeVars = freeVariables(cssAST);
            if (freeVars.length > 0) {
              freeVars.forEach(function(variable) {
                if (requires[variable]) {
                  cssSrc = (
                    'var ' + variable + ' = '
                    + recast.print(requires[variable].ast).code + '\n'
                    + cssSrc
                  );
                }
              });
            }
            cssSrc = 'var __result__ = (function() {' + cssSrc + '})();';
            var sandbox = {
              require: function(mod) {
                var dirname = path.relative(__dirname, path.dirname(fileName));
                return require(path.join(dirname, mod));
              }
            };
            vm.runInNewContext(cssSrc, sandbox, __filename);
            var cssCode = sandbox.__result__;

            var classNames = Object.keys(cssCode);
            for (var j = 0, l2 = classNames.length; j < l2; j++) {
              var className = classNames[j];
              addCSSClass(cssMapping, fileName, className, cssCode[className]);
            }
          }
          else {
            var cssClassName;
            this.traverse(node, {
              visit: function(childNode) {
                var value = childNode.value[0].value;
                if (value && value.property) {
                  cssClassName = value.property.name;
                }
              }
            });
            if (cssClassName) {
              props.push(
                  b.property('init',
                      b.identifier('css'),
                      b.literal(' ' + getUniqueCSSKey(fileName, cssClassName))
                  )
              );
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

    // Here we replace all the occurrences of this.css().foo,
    // css().foo, else.css().bla, etc. with the corresponding classNames
    visitMemberExpression: function(node) {
      var name;
      var obj = node.value.object;
      var propertyName = node.value.property.name;
      if (obj.name === 'css') {
        return b.literal(' ' + getUniqueCSSKey(fileName, propertyName));
      }
      else if (propertyName === 'css') {
        var parentParent = node.parent.parent;
        var property = parentParent.value.property;
        if (property) {
          name = property.name;
          parentParent.replace(
              b.literal(' ' + getUniqueCSSKey(fileName, name))
          );
        }
        return false;
      }
      else if (obj.callee && obj.callee.name === 'css') {
        node.replace(b.literal(' ' + getUniqueCSSKey(fileName, propertyName)));
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
      // if declaration doesn't have any declarators remove it completely
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

    transformations.css = convertJSONToCSS(cssMapping);

    return transformations;
  }

};

module.exports = Transformer;
