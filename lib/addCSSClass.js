'use strict';

var generateCSSClassName = require('./generateCSSClassName');

/**
 * Add a CSS class to the given cssMapping object
 *
 * @param {{}} cssMapping
 * @param {string} filename 
 * @param {string} styleName
 * @param {{}} classBody
 */
function addCSSClass(cssMapping, filename, styleName, classBody) {
  var className = generateCSSClassName(filename, styleName);
  cssMapping[className] = {classBody: classBody};
  return className;
}

module.exports = addCSSClass;
