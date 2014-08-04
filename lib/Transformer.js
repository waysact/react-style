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
      var properties = node.value.properties.map(function(property) {
        var callee = node.parentPath.parentPath.value.callee;
        if (callee
            && callee.type === 'MemberExpression'
            && callee.property.name === 'createClass'
            && property.key.name === 'css') {
          // simple way of checking if it's a React component by
          // looking for createClass

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

          var styleNames = Object.keys(cssCode);
          var styleProps = [];
          for (var j = 0, l2 = styleNames.length; j < l2; j++) {
            var styleName = styleNames[j];
            var className = addCSSClass(cssMapping, fileName, styleName, cssCode[styleName]);
            styleProps.push(
              b.property('init',
                b.literal(styleName),
                b.literal(className)));
          }
          return b.property('init',
            b.identifier('css'),
            b.functionExpression(null, [],
              b.blockStatement([b.returnStatement(b.objectExpression(styleProps))])));
        } else {
          return property;
        }
      });

      return b.objectExpression(properties);
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
