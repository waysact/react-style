'use strict';

var assign                 = require("react/lib/Object.assign");
var recalcMediaQueryStyles = require('./recalcMediaQueryStyles');

var matchMedia = null;
if (typeof window !== 'undefined' && !window.__ReactStyle__) {
  matchMedia = window.matchMedia;
}
var mediaQueryBreakPoints = {};
var hasVisibilityChangeListener = false;

function applyMediaQueries(registeredMediaQueries, stylesheet, register) {
  var newStyleSheet = {};
  var styles = Object.keys(stylesheet);

  function recalc() {
    recalcMediaQueryStyles(registeredMediaQueries);
  }

  if (!hasVisibilityChangeListener) {
    hasVisibilityChangeListener = true;
    document.addEventListener("visibilitychange", function(){
      if (document.visible) {
        recalc();
      }
    });
  }


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

          // warn for undeclared block
          if ("production" !== process.env.NODE_ENV) {
            if (!stylesheet[prop]) {
              console.warn('Media query \'' + styleName + '\' referred to undeclared style block \'' + prop + '\'.');
              continue;
            }
          }
          newStyleSheet[prop] = assign({}, newStyleSheet[prop], style[prop]);
        }
      }

      // register media query for recalc
      if (register) {
        registeredMediaQueries.push({
          elements: [],
          isActive: isMediaQueryActive,
          query: mediaQuery,
          stylesheet: stylesheet,
          compiled: newStyleSheet
        });

        if (!mediaQueryBreakPoints[mediaQuery]) {
          window.matchMedia(mediaQuery).addListener(recalc);
          mediaQueryBreakPoints[mediaQuery] = true;
        }
      }
    }
    else {
      newStyleSheet[styleName] = style;
    }
  }

  return newStyleSheet;
}



module.exports = applyMediaQueries;