'use strict';

var assign                          = require("react/lib/Object.assign");
var applyStyles                     = require('./applyStyles');
var enqueueForceUpdate;

// fugly
try {
  // React 0.13
  enqueueForceUpdate = require('react/lib/ReactUpdateQueue').enqueueForceUpdate;
} catch(e) {
  // React 0.12
  enqueueForceUpdate = require('react/lib/ReactUpdates').enqueueUpdate;
}
var matchMedia = null;
if (typeof window !== 'undefined' && !window.__ReactStyle__) {
  matchMedia = window.matchMedia;
}

function recalcElementStyles(registeredMediaQuery, element, compiledStyleSheet) {
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
  if (element._setPropsInternal) {
    // React 0.12
    element._setPropsInternal({style: newProps.style, __reactStyleOld: newReactStyleOld});
  } else {
    // React 0.13
    element.props = assign({}, element.props, {
                              style : newProps.style,
                              __reactStyleOld: newReactStyleOld});

  }
  enqueueForceUpdate(element);
}

function recalcMediaQueryStyle(registeredMediaQuery, registeredMediaQueries) {
  var applyMediaQueries = require('./applyMediaQueries');
  registeredMediaQuery.isActive = !registeredMediaQuery.isActive;
  var compiledStyleSheet = applyMediaQueries(registeredMediaQueries, registeredMediaQuery.stylesheet, false);
  for (var j = 0, l2 = registeredMediaQuery.elements.length; j < l2; j++) {
    var element = registeredMediaQuery.elements[j];
    recalcElementStyles(registeredMediaQuery, element, compiledStyleSheet);
  }
  registeredMediaQuery.compiled = compiledStyleSheet;
}

function recalcMediaQueryStyles(registeredMediaQueries) {
  for (var i = 0, l = registeredMediaQueries.length; i < l; i++) {
    var registeredMediaQuery = registeredMediaQueries[i];
    var matchesQuery = matchMedia(registeredMediaQuery.query).matches;
    var isActive = registeredMediaQuery.isActive;
    if ((matchesQuery && !isActive) || (!matchesQuery && isActive)) {
      recalcMediaQueryStyle(registeredMediaQuery, registeredMediaQueries);
    }
  }
}



module.exports = recalcMediaQueryStyles;