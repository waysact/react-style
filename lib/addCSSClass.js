'use strict';

var path = require('path');

var generateCSSClassName = require('./generateCSSClassName');

/**
 * Add a CSS class to the given cssMapping object
 *
 * @param {{}} cssMapping
 * @param {string} fileName
 * @param {string} styleName
 * @param {{}} classBody
 * @param {{}} options
 */
function addCSSClass(cssMapping, fileName, styleName, classBody, options) {
  var className = generateCSSClassName(fileName, styleName);
  if (!options.compress) {
    var prefix = path.basename(fileName).split('.')[0] + '__' + styleName;
    className = prefix + '__' + className;
  }
  cssMapping[className] = {classBody: classBody};
  return className;
}

module.exports = addCSSClass;
