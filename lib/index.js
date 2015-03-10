'use strict';

var ReactElementExtended   = require('./ReactElementExtended');
var ReactCompositeComponentExtended = require('./ReactCompositeComponentExtended.js');
var enqueueForceUpdate;
// fugly
try {
  // 0.13
  enqueueForceUpdate = require('react/lib/ReactUpdateQueue').enqueueForceUpdate;
} catch(e) {
  // 0.12
  enqueueForceUpdate = require('react/lib/ReactUpdates').enqueueUpdate;
}
var ExecutionEnvironment   = require('react/lib/ExecutionEnvironment');
var applyStyles            = require('./applyStyles');
var stylesToCSS            = require('./stylesToCSS');
var assign                 = require("react/lib/Object.assign");
var isArray                = Array.isArray;
var generateUniqueCSSClassName = require('./generateUniqueCSSClassName');
var registeredMediaQueries = [];

var matchMedia = null;
if (typeof window !== 'undefined' && !window.__ReactStyle__) {
  matchMedia = window.matchMedia;

  // simple way to decide we need to recalc the stylesheets
  window.addEventListener('resize', function() {
    // TODO: throttle this!
    for (var i = 0, l = registeredMediaQueries.length; i < l; i++) {
      var registeredMediaQuery = registeredMediaQueries[i];
      var matchesQuery = matchMedia(registeredMediaQuery.query).matches;
      var isActive = registeredMediaQuery.isActive;
      if ((matchesQuery && !isActive) || (!matchesQuery && isActive)) {
        registeredMediaQuery.isActive = !registeredMediaQuery.isActive;
        var compiledStyleSheet = applyMediaQueries(registeredMediaQuery.stylesheet, false);
        for (var j = 0, l2 = registeredMediaQuery.elements.length; j < l2; j++) {
          var element = registeredMediaQuery.elements[j];
          var styleSheetNames = Object.keys(registeredMediaQuery.stylesheet);
          var styles = element.props.__reactStyleOld;
          var newReactStyleOld = [];
          for (var i2 = 0, l3 = styles.length; i2 < l3; i2++) {
            var style = styles[i2];
            newReactStyleOld[i2] = style;
            if (!style) {
              continue;
            }
            for (var i3 = 0, l4 = styleSheetNames.length; i3 < l4; i3++) {
              var styleName = styleSheetNames[i3];
              var styleSheetStyle = registeredMediaQuery.compiled[styleName];
              var compiledStyle = compiledStyleSheet[styleName];
              if (styleSheetStyle === style) {
                newReactStyleOld[i2] = compiledStyle;
              }
            }
          }
          var newProps = {};
          applyStyles(newProps, newReactStyleOld, 0);
          element._setPropsInternal({style: newProps.style, __reactStyleOld: newReactStyleOld});
          enqueueForceUpdate(element);
        }
        registeredMediaQuery.compiled = compiledStyleSheet;
      }
    }
  });
}

var styles = [];

function createStyle(props, className, originalClassName) {
  styles.push({
    style: props,
    className: className,
    originalClassName: originalClassName
  });
  return className;
}

function applyMediaQueries(stylesheet, register) {
  var newStyleSheet = {};
  var styles = Object.keys(stylesheet);
  for (var i = 0, l = styles.length; i < l; i++) {
    var styleName = styles[i];
    var style = stylesheet[styleName];
    // only position 0 = false, so !0 = true
    if (!styleName.indexOf('@media')) {
      var mediaQuery = styleName.substr('@media '.length);
      var isMediaQueryActive = false;

      if (matchMedia(mediaQuery).matches) {
        isMediaQueryActive = true;
        var props = Object.keys(style);
        for (var j = 0, l2 = props.length; j < l2; j++) {
          var prop = props[j];
          if ("production" !== process.env.NODE_ENV) {
            if (!stylesheet[prop]) {
              console.warn('Media query \'' + styleName + '\' referred to undeclared style block \'' + prop + '\'.');
              continue;
            }
          }
          newStyleSheet[prop] = assign({}, newStyleSheet[prop], style[prop]);
        }
      }
      if (register) {
        registeredMediaQueries.push({
          elements: [],
          isActive: isMediaQueryActive,
          query: mediaQuery,
          stylesheet: stylesheet,
          compiled: newStyleSheet
        });
      }
    }
    else {
      newStyleSheet[styleName] = style;
    }
  }
  return newStyleSheet;
}

function createStyleSheet(stylesheet, useClassName) {
  if (!useClassName) {
    // default
    stylesheet = applyMediaQueries(stylesheet, true);
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
      var uniqueKey = generateUniqueCSSClassName('', styleName);
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
  compile: function(maxLength) {
    return stylesToCSS(styles, maxLength || 10);
  },
  create: createStyleSheet
};

ReactCompositeComponentExtended.associateToMediaQuery = function(comp) {
  var styles = comp.props.__reactStyleOld;
  for (var i = 0, l = styles.length; i < l; i++) {
    var style = styles[i];
    for (var j = 0, l2 = registeredMediaQueries.length; j < l2; j++) {
      var registeredMediaQuery = registeredMediaQueries[j];
      var stylesheet = registeredMediaQuery.compiled;
      var stylesheetNames = Object.keys(stylesheet);
      for (var i2 = 0, l3 = stylesheetNames.length; i2 < l3; i2++) {
        var styleName = stylesheetNames[i2];
        var style2 = stylesheet[styleName];
        if (style === style2){
          registeredMediaQuery.elements.push(comp);
        }
      }
    }
  }
};


module.exports = StyleSheet;
