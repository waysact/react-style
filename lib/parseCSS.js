'use strict';

function parseCSS(props) {
  var convertedProps = {};
  props = String(props).replace(/\n/g, '');
  var rules = props.split(';');
  for (var i = 0, l = rules.length; i < l; i++) {
    var splitRule = rules[i].split(':');
    if (splitRule.length === 2) {
      convertedProps[splitRule[0].trim().replace(/-([a-z])/g, function (x, chr) {
        return chr.toUpperCase();
      })] = splitRule[1].trim();
    }
  }

  return convertedProps;
}

module.exports = parseCSS;
