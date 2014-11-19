'use strict';

var currCSSKey        = 0;
var uniqueKeys        = {};
var allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Get an unique CSS key for the className in a file. It supports up
 * to 140608 classNames.
 *
 * @param {string} fileName
 * @param {string} className
 * @return {*}
 */
function generateCSSClassName(fileName, className) {
  if (uniqueKeys[fileName + className]) {
    return uniqueKeys[fileName + className];
  }

  var allowedCharactersLength = allowedCharacters.length;
  var key1unit = allowedCharactersLength * allowedCharactersLength;
  var key1pos = Math.floor(currCSSKey / key1unit);
  var key1 = allowedCharacters[key1pos];
  var key2pos = Math.floor((currCSSKey -
    (key1 ? key1pos * key1unit : 0)) / allowedCharactersLength);
  var key2 = allowedCharacters[key2pos];
  var key3pos = (currCSSKey -
    (key1 ? (key1pos * key1unit) : 0) -
    (key2 ? key2pos * allowedCharactersLength : 0));
  var key3 = allowedCharacters[key3pos];
  var key = '';
  key += currCSSKey >= allowedCharactersLength * allowedCharactersLength ? key1 : '';
  key += currCSSKey >= allowedCharactersLength ? key2 : '';
  key += key3 || 'a';
  currCSSKey++;
  uniqueKeys[fileName + className] = key;

  return key;
}

module.exports = generateCSSClassName;