'use strict';

var getUniqueCSSKey = require('./getUniqueCSSKey');


/**
 * Add a CSS class to the given cssMapping object
 *
 * @param {{}} cssMapping
 * @param {string} fileName
 * @param {string} className
 * @param {{}} classBody
 */
function addCSSClass(cssMapping, fileName, className, classBody) {
  var classSplit = className.split(':');
  var name = classSplit[0];
  var pseudo;
  if (classSplit.length > 1) {
    pseudo = classSplit[1];
  }
  cssMapping[getUniqueCSSKey(fileName, name) + (pseudo ? ':' + pseudo : '')] = {
    classBody: classBody
  };
}

module.exports = addCSSClass;
