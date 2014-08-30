'use strict';

var prefixes = ['Ms', 'ms', 'webkit', 'moz', 'o'];

var el = document.createElement('div');
var cssPropertyNames = Object.keys(el.style);
el = null;
var cssPrefixFreePropertyNames = {};
var browserPrefixRegexp = /^webkit|^moz|^Ms|^ms|^webkit/;
for (var i = 0, l = cssPropertyNames.length; i < l; i++) {
  var cssPropertyName = cssPropertyNames[i];
  if (cssPropertyName.search(browserPrefixRegexp) === 0) {
    var prefixFreePropertyName =
        cssPropertyName.replace(browserPrefixRegexp, '');
    prefixFreePropertyName = prefixFreePropertyName[0].toLowerCase() +
        prefixFreePropertyName.substr(1);
    cssPrefixFreePropertyNames[prefixFreePropertyName] = true;
  }
}

function prefixCSS(obj) {
  var cssNames = Object.keys(obj);
  for (var i = 0, l = cssNames.length; i < l; i++) {
    var cssName = cssNames[i];
    var value = obj[cssName];
    if (cssPrefixFreePropertyNames[cssName]) {
      delete obj[cssName];
      for (var j = 0, len = prefixes.length; j < len; j++) {
        obj[prefixes[j] + cssName[0].toUpperCase() + cssName.substr(1)] = value;
      }
      obj[cssName] = value;
    }

  }
  return obj;
}

module.exports = prefixCSS;