'use strict';

var noPxPostfix = {
  columnCount: null,
  fillOpacity: null,
  flex: null,
  flexGrow: null,
  flexShrink: null,
  fontWeight: null,
  lineClamp: null,
  lineHeight: null,
  opacity: null,
  order: null,
  orphans: null,
  widows: null,
  zIndex: null,
  zoom: null
};

function addPxPostfix(cssClassBody) {
  if (!cssClassBody) {
    return;
  }
  var parameters = Object.keys(cssClassBody);
  for (var i = 0, l = parameters.length; i < l; i++) {
    var parameter = parameters[i];
    var value = cssClassBody[parameter];

    if (typeof value === 'number' && !(parameter in noPxPostfix) && value !== 0) {
      cssClassBody[parameter] = value + 'px';
    }
  }
}

module.exports = addPxPostfix;
