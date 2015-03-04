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

var registeredMediaQueries          = [];
var forceUseClasses                 = false;
var namedStyles                     = {};
var anonymousStyles                 = [];

function createStyle(props, className, originalClassName) {
  var stackFrames = ErrorStackParser.parse(new Error(''));
  var caller = stackFrames ? stackFrames[1] : {};

  var style = {
    style: props,
    className: className,
    originalClassName: originalClassName,
    caller: caller,
  };

  if (isAnonymous) {
    anonymousStyles.push(style);
  } else {
    namedStyles[className] = style;
  }

  return className;
}

function createStyleSheet(stylesheet, useClassName) {
  if (!useClassName && !forceUseClasses) {
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
      results[styleName] = createStyle(style, isMediaQuery ? styleName : uniqueKey, styleName);
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
  inject: function(callback) {
    if (!ExecutionEnvironment.canUseDOM) {
      // We are in Node or Styles are already injected
      callback(null);
    }
    else {
      var stylesheetURL = "http://gen.reactstyle/1.css";
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

          var linkElements = head.getElementsByTagName('link');
          for (var i=linkElements.length-1; i>=0; --i) {
            if (linkElements[i] != tag
                && linkElements[i].getAttribute('rel') == 'stylesheet'
                && linkElements[i].getAttribute('type') == 'text/css'
                && linkElements[i].getAttribute('data-react-style-url')) {

              linkElements[i].parentNode.removeChild(linkElements[i]);
            }
          }

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
      ReactStyle.inject(function() {});
    }
  });
}

module.exports = StyleSheet;
