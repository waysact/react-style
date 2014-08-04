'use strict';

var getUniqueCSSKey = require('./getUniqueCSSKey');


/**
 * Add a CSS class to the given cssMapping object
 *
 * @param {{}} cssMapping
 * @param {string} fileName
 * @param {string} styleName
 * @param {{}} classBody
 */
function addCSSClass(cssMapping, fileName, styleName, classBody) {
  var classSplit = styleName.split(':');
  var name = classSplit[0];
  var pseudo = classSplit.length > 1 ? classSplit[1] : undefined;
  var className = getUniqueCSSKey(fileName, name);
  cssMapping[className + (pseudo ? ':' + pseudo : '')] = {classBody: classBody};
  return className;
}

module.exports = addCSSClass;
