'use strict';

var isUnitlessNumber = require('react/lib/CSSProperty').isUnitlessNumber;
var hyphenateStyleName = require('react/lib/hyphenateStyleName');
var isArray = Array.isArray;
var keys = Object.keys;
var unsupportedPseudoClasses = require('./unsupportedPseudoClasses');

var counter = 1;
// Follows syntax at https://developer.mozilla.org/en-US/docs/Web/CSS/content,
// including multiple space separated values.
var unquotedContentValueRegex = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;

function buildRule(result, key, value) {
  if (!isUnitlessNumber[key] && typeof value === 'number') {
    value = '' + value + 'px';
  }
  else if (key === 'content' && !unquotedContentValueRegex.test(value)) {
    value = "'" + value.replace(/'/g, "\\'") + "'";
  }

  result.css += '  ' + hyphenateStyleName(key) + ': ' + value + ';\n';
}

function buildRules(result, rules, selector) {
  if (!rules || keys(rules).length === 0) {
    return result;
  }

  result.css += selector + ' {\n';
  var styleKeys = keys(rules);
  for (var j = 0, l = styleKeys.length; j < l; j++) {
    var styleKey = styleKeys[j];
    var value = rules[styleKey];

    if (unsupportedPseudoClasses[styleKey.split('(')[0].trim()]) {
      if ("production" !== process.env.NODE_ENV) {
        console.warn('You are trying to use pseudo class ' + styleKey +
        ', which we don\'t support as this is better implemented using ' +
        'JavaScript.');
      }

      continue;
    }

    if (isArray(value)) {
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

function replicateSelector(s) {
  return [
    s,
      s + (s + 1),
      s + (s + 1) + (s + 2),
      s + (s + 1) + (s + 2) + (s + 3),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4) + (s + 5),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4) + (s + 5) + (s + 6),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4) + (s + 5) + (s + 6) + (s + 7),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4) + (s + 5) + (s + 6) + (s + 7) + (s + 8),
      s + (s + 1) + (s + 2) + (s + 3) + (s + 4) + (s + 5) + (s + 6) + (s + 7) + (s + 8) + (s + 9)
  ].join(',');
}

function buildStyle(result, style, selector) {
  if (!style.className) {
    return;
  }

  if (!selector && result.classNames[style.className]) {
    return;
  }

  if (!selector) {
    result.classNames[style.className] = counter++;
    selector = replicateSelector('.' + style.className);
  }

  buildRules(result, style.style, selector);
}

function stylesToCSS(styles) {
  if (!isArray(styles)) {
    styles = [styles];
  }

  var result = {css: '', classNames: {}};
  for (var i = 0, len = styles.length; i < len; i++) {
    var style = styles[i];
    buildStyle(result, style);
  }
  return result;
}

module.exports = stylesToCSS;
