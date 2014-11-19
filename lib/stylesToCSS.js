'use strict';

var CSSProperty              = require('react/lib/CSSProperty');
var hyphenateStyleName       = require('react/lib/hyphenateStyleName');
var unsupportedPseudoClasses = require('./unsupportedPseudoClasses');

function buildRule(result, key, value) {
  var toCSS = value.toCSS;
  if (typeof toCSS === 'function') {
    value = toCSS();
  }
  if (!CSSProperty.isUnitlessNumber[key] && typeof value === 'number') {
    value = '' + value + 'px';
  }
  result.css += '  ' + hyphenateStyleName(key) + ': ' + value + ';\n';
}

function buildRules(result, rules, selector) {
  if (Object.keys(rules).length === 0) {
    return result;
  }

  result.css += selector + ' {\n';
  var styleKeys = Object.keys(rules);
  for (var j = 0, l = styleKeys.length; j < l; j++) {
    var styleKey = styleKeys[j];
    var value = rules[styleKey];

    if (unsupportedPseudoClasses[styleKey.split('(')[0].trim()]) {
      if ("production" !== process.env.NODE_ENV) {
        console.warn('You are using unsupported ' +
        'pseudo-class ' + styleKey + '. We don\'t ' +
        'support this pseudo-class due to the influence ' +
        'it has on CSS precedence and therefore breaks ' +
        'out of the React Style require-tree model. ' +
        'You should solve this using a JavaScript-based ' +
        'equivalent. More details: [url]');
      }

      continue;
    }

    if (Array.isArray(value)) {
      for (var i = 0, len = value.length; i < len; i++) {
        buildRule(result, styleKey, value[i]);
      }
    }
    else {
      buildRule(result, styleKey, value);
    }
  }
  result.css += '}\n';

  return result;
}

function buildStyle(result, style, selector) {
  if (!style.className) {
    return;
  }
  if (!selector && result.classNames[style.className]) {
    return;
  }

  if (!selector) {
    result.classNames[style.className] = true;
    selector = '.' + style.className;
  }

  buildRules(result, style.style, selector);
}

function stylesToCSS(styles) {
  if (!Array.isArray(styles)) {
    styles = [styles];
  }

  var result = {css: '', classNames: {}};

  for (var i = 0, len = styles.length; i < len; i++) {
    buildStyle(result, styles[i]);
  }

  return result;
}

module.exports = stylesToCSS;
