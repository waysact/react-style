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
var stylesToCSS            = require('./stylesToCSS');
var assign                 = require("react/lib/Object.assign");
var isArray                = Array.isArray;
var generateUniqueCSSClassName = require('./generateUniqueCSSClassName');
var registeredMediaQueries = [];

var matchMedia = null;
if (typeof window !== 'undefined') {
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
        for (var j = 0, l2 = registeredMediaQuery.elements.length; j < l2; j++) {
          var element = registeredMediaQuery.elements[j];
          var keys = Object.keys(registeredMediaQuery.stylesheet);
          var chosenName;
          for (var i2 = 0, l3 = keys.length; i2 < l3; i2++) {
            var name = keys[i2];
            if (element.props.__reactStyleOld === registeredMediaQuery.stylesheet[name]) {
              chosenName = name;
              break;
            }
          }
          var newlyCompiledStyleSheet = registeredMediaQuery.compiled = createStyleSheet(registeredMediaQuery.stylesheet);
          console.dir(registeredMediaQuery.compiled);
          element._setPropsInternal({style: newlyCompiledStyleSheet[chosenName]});
          enqueueForceUpdate(element);
        }
      }
    }
  });
}

var styles = [];

function createStyle(props, className) {
  styles.push({
    style: props,
    className: className
  });

  return className;
}

function applyMediaQueries(stylesheet) {
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

      registeredMediaQueries.push({
        elements:   [],
        isActive:   isMediaQueryActive,
        query:      mediaQuery,
        stylesheet: stylesheet,
        compiled:   newStyleSheet
      });
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
    stylesheet = applyMediaQueries(stylesheet);
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
  compile: function(maxLength) {
    return stylesToCSS(styles, maxLength || 10);
  },
  create: createStyleSheet
};

ReactCompositeComponentExtended.associateToMediaQuery = function(comp) {
  var styles = comp.props.__reactStyleOld;
  if (!isArray(styles)){
    styles = [styles];
  }
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
