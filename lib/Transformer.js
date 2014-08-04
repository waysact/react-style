'use strict';

var esprima = require('esprima-fb');
var freeVariables = require('free-variables');
var path = require('path');
var recast = require('recast');
var vm = require('vm');

var b = recast.types.builders;

var hasThisExpression = require('./hasThisExpression');
var addCSSClass = require('./addCSSClass');
var convertJSONToCSS = require('./convertJSONToCSS');
var cssMapping = {};
var getUniqueCSSKey = require('./getUniqueCSSKey');

function wrapCSSGeneratorCallExprssion(args) {
  var moduleAST = b.callExpression(
    b.identifier('require'),
    [b.literal('integratedcss/lib/runtime')]);
  var wrapCSSGeneratorAST = b.memberExpression(
    moduleAST,
    b.identifier('wrapCSSGenerator'),
    false);
  return b.callExpression(wrapCSSGeneratorAST, args);
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
      if (this.isModuleRequire(node)) {
        var parentValue = node.parentPath.value;
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
      if (!this.isCreateClass(node)) {
        return false;
      }
      return b.objectExpression(node.value.properties.map(function(property) {
        if (!this.isStyleDeclaration(property)) {
          return property;
        }
        var styleName = property.key.name;
        var cssAST = property.value.body;

        if (hasThisExpression(cssAST)) {
          return b.property('init',
            b.identifier(styleName),
            wrapCSSGeneratorCallExprssion([property.value]));
        } else {
          return b.property('init',
            b.identifier(styleName),
            this.evaluateStyle(styleName, cssAST));
        }
      }, this));
    },

    isCreateClass: function(node) {
        var callee = node.parentPath.parentPath.value.callee;
        return (
          callee
          && callee.type === 'MemberExpression'
          && callee.property.name === 'createClass'
        );
    },

    isModuleRequire: function(node) {
      var callee = node.value.callee;
      var parentValue = node.parentPath.value;
      return (
        callee.type === 'Identifier'
        && callee.name === 'require'
        && parentValue.type === 'VariableDeclarator'
        && parentValue.id.type === 'Identifier'
      );
    },

    isStyleDeclaration: function(property) {
      return (
        property.key.name === 'style'
        || /Style$/.exec(property.key.name)
      );
    },

    evaluateStyle: function(styleName, ast) {
      var src = recast.print(ast).code;

      var freeVars = freeVariables(ast);
      if (freeVars.length > 0) {
        freeVars.forEach(function(variable) {
          if (requires[variable]) {
            src = (
              'var ' + variable + ' = '
              + recast.print(requires[variable].ast).code + '\n'
              + src
            );
          }
        });
      }
      src = 'var __result__ = (function() {' + src + '})();';
      var sandbox = {
        require: function(mod) {
          var dirname = path.relative(__dirname, path.dirname(fileName));
          return require(path.join(dirname, mod));
        }
      };
      vm.runInNewContext(src, sandbox, __filename);
      var cssCode = sandbox.__result__;
      var className = addCSSClass(cssMapping, fileName, styleName, cssCode);
      return b.functionExpression(null, [],
        b.blockStatement([b.returnStatement(b.literal(className))]));
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
