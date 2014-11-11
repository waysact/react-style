'use strict';

var CSSProperty = require('react/lib/CSSProperty');
var hyphenateStyleName = require('react/lib/hyphenateStyleName');

function buildRule(result, key, value) {
  if (typeof value.toCSS === 'function') {
    value = value.toCSS();
  }
  if (!CSSProperty.isUnitlessNumber[key] && typeof value === 'number') {
    value = '' + value + 'px';
  }
  // TODO: escape value
  result.css += '  ' + hyphenateStyleName(key) + ': ' + value + ';\n';
}

function buildRules(result, rules, selector) {
  if (Object.keys(rules).length === 0) {
    return result;
  }

  result.css += selector + ' {\n';
  for (var styleKey in rules) {
    if (!rules.hasOwnProperty(styleKey)) {
      continue;
    }
    var value = rules[styleKey];

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

  if (style.children) {
    for (var childKey in style.children) {
      if (!style.children.hasOwnProperty(childKey)) {
        continue;
      }
      var child = style.children[childKey];
      if (childKey[0] === ':') {
        var childSelector = selector.split(',')
          .map(function(sel) {
            return sel + childKey;
          })
          .join(',');
        buildStyle(result, child, childSelector);
      }
      else {
        buildStyle(result, child);
      }
    }
  }
}

function stylesToCSS(styles) {
  console.log('re-arrange me please:', styles);

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
