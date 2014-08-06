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

/**
 * @param {{file: String, contents: String}} file
 * @param {CSSMapping} cssMapping
 */
function transform(file) {
  var ast = recast.parse(file.contents.toString(), {esprima: esprima});
  var requires = {};
  var cssMapping = {};

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

    visitObjectExpression: function(node) {
      if (!this.isCreateClass(node)) {
        return false;
      }
      return b.objectExpression(node.value.properties.map(function(property) {
        if (!this.isStyleDeclaration(property)) {
          return property;
        }
        var styleName = property.key.name;
        var cssAST = property.value.arguments[0].body;

        if (hasThisExpression(cssAST)) {
          return property;
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
        property.value.type === 'CallExpression'
        && property.value.callee.type === 'Identifier'
        && property.value.callee.name === 'IntegratedStyle'
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
          var dirname = path.relative(__dirname, path.dirname(file.name));
          return require(path.join(dirname, mod));
        }
      };
      vm.runInNewContext(src, sandbox, __filename);
      var cssCode = sandbox.__result__;
      var className = addCSSClass(cssMapping, file.name, styleName, cssCode);
      return b.functionExpression(null, [],
        b.blockStatement([b.returnStatement(b.literal(className))]));
    }
  });

  return {
    name: file.name,
    contents: recast.print(ast).code,
    cssMapping: cssMapping
  };
}

/**
 * @param {[{file: String, contents: String}]} files
 */
function transformMany(files) {
  var result = files.reduce(function(result, file) {
    var transformed = transform(file);
    result.files.push({name: transformed.name, contents: transformed.contents});
    for (var name in transformed.cssMapping) {
      if (transformed.cssMapping.hasOwnProperty(name)) {
        result.cssMapping[name] = transformed.cssMapping[name];
      }
    }
    return result;
  }, {cssMapping: {}, files: []});

  return {
    files: result.files,
    css: convertJSONToCSS(result.cssMapping)
  };
}

var Transformer = {
  transform: transform,
  transformMany: transformMany
};

module.exports = Transformer;
