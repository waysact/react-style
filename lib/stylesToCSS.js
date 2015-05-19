'use strict';

var isUnitlessNumber = require('react/lib/CSSProperty').isUnitlessNumber;
var hyphenateStyleName = require('react/lib/hyphenateStyleName');
var isArray = Array.isArray;
var keys = Object.keys;
var unsupportedPseudoClasses = require('./unsupportedPseudoClasses');
var url = require('url');
var sourceMapResolve = require('source-map-resolve');
var sourceMap = require('source-map');

var counter = 1;
// Follows syntax at https://developer.mozilla.org/en-US/docs/Web/CSS/content,
// including multiple space separated values.
var unquotedContentValueRegex = /^(normal|none|(\b(url\([^)]*\)|chapter_counter|attr\([^)]*\)|(no-)?(open|close)-quote|inherit)((\b\s*)|$|\s+))+)$/;

function buildRule(key, value) {
  if (!isUnitlessNumber[key] && typeof value === 'number') {
    value = '' + value + 'px';
  }
  else if (key === 'content' && !unquotedContentValueRegex.test(value)) {
    value = "'" + value.replace(/'/g, "\\'") + "'";
  }

  return hyphenateStyleName(key) + ':' + value + ';';
}

function buildRules(result, rules, selector) {
  if (!rules || keys(rules).length === 0) {
    return null;
  }

  var line = selector + '{';
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
        line += buildRule(styleKey, value[i]);
      }
    }
    else {
      line += buildRule(styleKey, value);
    }
  }
  line += '}';

  result.css += line + '\n';
  return line;
}

function buildMediaQuery(result, rules, selector, style) {
  var numLines = 2;
  result.css += selector + '{\n';
  var ruleKeys = Object.keys(rules);
  for (var i = 0, l = ruleKeys.length; i < l; i++) {
    var ruleKey = ruleKeys[i];
    var rule = rules[ruleKey];
    numLines += buildRules(result, rule, '.' + ruleKey);
  }
  result.css += '}\n';
  return numLines;
}

function replicateSelector(s, max) {
  var maxLength = max || 10;
  var replicatedSelector = [];
  for (var i = 0; i < maxLength; i++) {
    var newSelector = '.' + s;
    var q = s.replace(/^.*_([^_]+)$/, '$1');
    for (var j = 1, l2 = i + 1; j < l2; j++) {
      newSelector += '.' + q + j;
    }
    replicatedSelector[i] = newSelector;
  }
  return replicatedSelector.join(',');
}

function buildStyle(result, style, selector, maxLength) {
  if (!style.className) {
    return null;
  }
  if (!selector && result.classNames[style.className]) {
    return null;
  }
  if (!selector) {
    result.classNames[style.className] = counter++;
    selector = replicateSelector(style.className, maxLength);
  }
  if(!selector.indexOf('.@media ')) {
    return buildMediaQuery(result, style.style, selector.substr(1));
  } else {
    return buildRules(result, style.style, selector);
  }
}

var sourceMapCache = {};

function loadSourceMapForURL(sourceURL, callback) {

  if (sourceMapCache[sourceURL]) {
    callback(null, sourceMapCache[sourceURL]);
  }
  else {
    var readAsync = function(url, callback) {
      if (typeof XMLHttpRequest === "undefined") {
        callback("Source map tracing unavailable outside of browser")
        return;
      }
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            callback(null, httpRequest.responseText);
          } else {
            callback("HTTP status " + httpRequest.status);
          }
        }
      };
      httpRequest.open('GET', url, true);
      httpRequest.send(null);
    };

    readAsync(sourceURL, function(err, code) {
      sourceMapResolve.resolveSourceMap(
        code, sourceURL, readAsync,
        function(err, result) {
          if (!err) {
            var map = new sourceMap.SourceMapConsumer(result.map)
            sourceMapCache[sourceURL] = map;
            callback(null, map);
          } else {
            callback(err, null);
          }
        });
    });
  }
}

function stylesToCSS(styles, maxLength, stylesheetURL, callback) {
  if (!isArray(styles)) {
    styles = [styles];
  }
  else {
    styles = styles.slice();
  }

  var result = {
    css: '',
    classNames: {},
    sourceMap: new sourceMap.SourceMapGenerator({ file: stylesheetURL })
  };

  var generatedLine = 1;

  var buildNextStyle = function() {
    if (styles.length == 0) {
      callback(null, result);
    }
    else {
      var style = styles.pop();

      var newLine = buildStyle(result, style, null, maxLength);
      if (newLine != null) {
        var curGeneratedLine = generatedLine;
        generatedLine += 1;

        if (style.caller && style.caller.resolved) {
          result.sourceMap.addMapping({
            original: {
              line: style.caller.lineNumber,
              column: style.caller.columnNumber,
            },
            generated: {
              line: curGeneratedLine,
              column: 0,
            },
            source: style.caller.fileName
          });
          result.sourceMap.addMapping({
            original: {
              line: style.caller.endLineNumber,
              column: style.caller.endColumnNumber,
            },
            generated: {
              line: curGeneratedLine,
              column: newLine.length - 1,
            },
            source: style.caller.fileName
          });
          buildNextStyle();
        }
        else if (style.caller
                 && style.caller.fileName
                 && style.caller.lineNumber !== undefined) {
          loadSourceMapForURL(
            style.caller.fileName,
            function(err, map) {
              if (!err) {
                var originalPosition = map.originalPositionFor({
                  line: style.caller.lineNumber,
                  column: style.caller.columnNumber || 0,
                  bias: sourceMap.SourceMapConsumer.GREATEST_LOWER_BOUND
                });

                result.sourceMap.addMapping({
                  original: {
                    line: originalPosition.line,
                    column: originalPosition.column,
                  },
                  generated: {
                    line: curGeneratedLine,
                    column: 0,
                  },
                  source: url.resolve(style.caller.fileName,
                                      originalPosition.source)
                });
              }
              buildNextStyle();
            });
        } else {
          buildNextStyle();
        }
      } else {
        buildNextStyle();
      }
    }
  }

  buildNextStyle();
}

module.exports = stylesToCSS;
