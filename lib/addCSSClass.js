'use strict';

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
function addCSSClass(cssMapping, fileName, styleName, classBody) {
  var className = generateCSSClassName(fileName, styleName);
  for (var propertyName in classBody) {
    var pseudoBody = classBody[propertyName];
    if (propertyName.indexOf(':') === 0 && pseudoBody) {
      cssMapping[className + propertyName] = {
        classBody: pseudoBody
      };
      delete classBody[propertyName];
  }
  }


  cssMapping[className] = {classBody: classBody};
  return className;
}

module.exports = addCSSClass;
