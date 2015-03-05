'use strict';

var assign                          = require("react/lib/Object.assign");
var ReactElementExtended            = require('./ReactElementExtended');
var ReactCompositeComponentExtended = require('./ReactCompositeComponentExtended.js');
var ExecutionEnvironment            = require('react/lib/ExecutionEnvironment');

var applyMediaQueries               = require('./applyMediaQueries');
var generateUniqueCSSClassName      = require('./generateUniqueCSSClassName');
var stylesToCSS                     = require('./stylesToCSS');
var ExecutionEnvironment            = require('react/lib/ExecutionEnvironment');
var assign                          = require("react/lib/Object.assign");
var isArray                         = Array.isArray;
var ErrorStackParser                = require('error-stack-parser');
var camelizeStyleName               = require("react/lib/camelizeStyleName");
var url                             = require("url");

var registeredMediaQueries          = [];
var forceUseClasses                 = false;
var namedStyles                     = {};
var anonymousStyles                 = [];
var autoPrefixData                  = { props: {}, prefix: {} };

function createStyle(props, className, originalClassName, options) {
  var caller;
  if (options.file && options.sourcemap) {
    caller = {
      fileName: options.file,
      lineNumber: options.sourcemap[originalClassName].start.line,
      columnNumber: options.sourcemap[originalClassName].start.column,
      endLineNumber: options.sourcemap[originalClassName].end.line,
      endColumnNumber: options.sourcemap[originalClassName].end.column,
      resolved: true,
    };
  } else {
    var stackFrames = ErrorStackParser.parse(new Error(''));
    caller = stackFrames ? stackFrames[1] : {};
  }

  var prefixedProps = {};
  for (var key in props) {
    if (!props.hasOwnProperty(key)) {
      continue;
    }
    var value = props[key];
    prefixedProps[key] = value;

    var prefixes = autoPrefixData.props[key] || 0;
    var prefixIndex = 0;
    while (prefixes) {
      if (prefixes & 1) {
        var prefixedKey = camelizeStyleName(autoPrefixData.prefix[prefixIndex] + key);
        prefixedProps[prefixedKey] = value;
      }
      prefixIndex += 1;
      prefixes >>>= 1;
    }
  }

  var style = {
    style: prefixedProps,
    className: className,
    originalClassName: originalClassName,
    caller: caller,
  };

  if (options.useClassName) {
    namedStyles[className] = style;
  } else {
    anonymousStyles.push(style);
  }

  return className;
}

function createStyleSheet(stylesheet, options) {
  options = options || {};
  if (!options.useClassName && !forceUseClasses) {
    // default
    stylesheet = applyMediaQueries(registeredMediaQueries, stylesheet, true);
    return stylesheet;
  }
  else {
    ReactElementExtended.maxOverridesLength = StyleSheet.maxOverridesLength;

    // export to separate CSS classes
    var styleSheetStyles = Object.keys(stylesheet);
    var results = {};
    for (var i = 0, l = styleSheetStyles.length; i < l; i++) {
      var styleName = styleSheetStyles[i];
      var isMediaQuery = !styleName.indexOf('@media ');
      var style = stylesheet[styleName];
      var uniqueKey = generateUniqueCSSClassName();
      if ("production" !== process.env.NODE_ENV) {
        uniqueKey = styleName + '_' + uniqueKey;
      }

      if (isMediaQuery) {
        var mqStyleNames = Object.keys(style);
        var newStyle = {};
        for (var i2 = 0, l2 = mqStyleNames.length; i2 < l2; i2++) {
          var mqStyleName = mqStyleNames[i2];
          var mqStyle = style[mqStyleName];
          var uniqueKey2 = results[mqStyleName];
          if (uniqueKey2) {
            newStyle[uniqueKey2] = mqStyle;
          }
        }
        style = newStyle;
      }
      results[styleName] = createStyle(style, isMediaQuery ? styleName : uniqueKey, styleName, options);
    }

    return results;
  }
}

var StyleSheet = {
  compile: function(maxLength, stylesheetURL, callback) {
    var styleDefs = anonymousStyles.slice();
    for(var key in namedStyles) {
      styleDefs.push(namedStyles[key]);
    }
    stylesToCSS(styleDefs, StyleSheet.maxOverridesLength || 10, stylesheetURL, callback);
  },
  create: createStyleSheet,
  setForceUseClasses: function(flag) {
    forceUseClasses = flag;
  },
  /**
   *  data should be an object with two keys: `prefix` and `props`.
   *
   *  `prefix` should be an array with camel-case prefixes, such as
   *  `Webkit`.
   *
   *  `props` should be an object whose keys are camel-case CSS
   *  property names and whose values integers.  The integer is
   *  interpreted as a bitfield with bit 0 corresponding to the first
   *  prefix, bit 1 corresponding to the second prefix and so on.
   */
  setAutoprefixData: function(data) {
    autoPrefixData = data;
  },
  inject: function(callback) {
    if (!ExecutionEnvironment.canUseDOM) {
      // We are in Node or Styles are already injected
      callback(null);
    }
    else {
      var stylesheetURL = url.resolve(window.location.href, "/react-style/generated/1.css");
      this.compile(undefined, stylesheetURL, function(err, compiled) {
        if (err) {
          callback(err);
        }
        else {
          var head = document.getElementsByTagName('head')[0];
          var sourceURLComment =
              '/*# sourceURL=' + stylesheetURL + ' */\n';
          var sourceMappingURLComment =
              '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,'
              + btoa(compiled.sourceMap.toString())
              + ' */\n'
          var stylesheet =
              compiled.css + "\n" +
              sourceURLComment +
              sourceMappingURLComment;

          var tag = document.createElement('link');
          tag.setAttribute('rel', 'stylesheet');
          tag.setAttribute('type', 'text/css');
          tag.setAttribute('href', 'data:text/css;charset=utf-8;base64,' + btoa(stylesheet));
          tag.setAttribute('data-react-style-url', stylesheetURL);
          window.__ReactStyle__ = compiled.classNames;
          head.appendChild(tag);

          var purgeOldStyleSheets = function() {
            var linkElements = head.getElementsByTagName('link');
            for (var i=linkElements.length-1; i>=0; --i) {
              if (linkElements[i] != tag
                  && linkElements[i].getAttribute('rel') == 'stylesheet'
                  && linkElements[i].getAttribute('type') == 'text/css'
                  && linkElements[i].getAttribute('data-react-style-url')) {

                linkElements[i].parentNode.removeChild(linkElements[i]);
              }
            }
          };
          setTimeout(purgeOldStyleSheets, 0);

          callback(null);
        }
      });
    }
  }
};

ReactCompositeComponentExtended.associateToMediaQuery = function(comp) {
  var styles = comp.props.__cachedStyles;
  for (var i = 0, l = styles.length; i < l; i++) {
    var style = styles[i];
    for (var j = 0, l2 = registeredMediaQueries.length; j < l2; j++) {
      var registeredMediaQuery = registeredMediaQueries[j];
      var stylesheet = registeredMediaQuery.compiled;
      var stylesheetNames = registeredMediaQuery.styleNames;
      for (var i2 = 0, l3 = stylesheetNames.length; i2 < l3; i2++) {
        var styleName = stylesheetNames[i2];
        var compiledStyle = stylesheet[styleName];
        if (style === compiledStyle) {
          registeredMediaQuery.elements.push(comp);
        }
      }
    }
  }
};

if (module.hot) {
  module.hot.addStatusHandler(function(newStatus) {
    if (newStatus == 'idle') {
      StyleSheet.inject(function() {});
    }
  });
}

module.exports = StyleSheet;
