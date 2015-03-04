'use strict';

var ReactElementExtended = require('./ReactElementExtended');

var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var stylesToCSS            = require('./stylesToCSS');
var assign                 = require("react/lib/Object.assign");
var isArray                = Array.isArray;
var generateUniqueCSSClassName = require('./generateUniqueCSSClassName');
var ErrorStackParser       = require('error-stack-parser');
var camelizeStyleName      = require("react/lib/camelizeStyleName");

var forceUseClasses = false;

var namedStyles = {};
var anonymousStyles = [];
var autoPrefixData = { props: {}, prefix: {} };

  }

function createStyle(props, className) {
  var stackFrames = ErrorStackParser.parse(new Error(''));
  var caller = stackFrames ? stackFrames[1] : {};

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
    return stylesheet;
  }
  else {
    ReactElementExtended.maxOverridesLength = StyleSheet.maxOverridesLength;

    // export to separate CSS classes
    var styleSheetStyles = Object.keys(stylesheet);
    var results = {};
    for (var i = 0, l = styleSheetStyles.length; i < l; i++) {
      var styleName = styleSheetStyles[i];
      var style = stylesheet[styleName];
      var uniqueKey = generateUniqueCSSClassName('', styleName);
      if ("production" !== process.env.NODE_ENV) {
        uniqueKey = styleName + '_' + uniqueKey;
      }

      results[styleName] = createStyle(style, uniqueKey);
    }
    return results;
  }
}

var StyleSheet = {
  create: createStyleSheet,
  compile: function(maxLength, stylesheetURL, callback) {
    var styleDefs = anonymousStyles.slice();
    for(var key in namedStyles) {
      styleDefs.push(namedStyles[key]);
    }
    stylesToCSS(styleDefs, maxLength || 10, stylesheetURL, callback);
  },
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

if (module.hot) {
  module.hot.addStatusHandler(function(newStatus) {
    if (newStatus == 'idle') {
      ReactStyle.inject(function() {});
    }
  });
}

module.exports = StyleSheet;
