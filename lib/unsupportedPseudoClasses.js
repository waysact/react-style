/**
 * Within react-style the order and specificity of CSS rules is determined by
 * the require-tree. Unfortunately pseudo classes break this due to giving more
 * weight to a CSS selector, therefore we don't support all pseudo classes.
 *
 * We are using a black-list approach as we understand that not all
 * pseudo-classes can be implemented with normal JavaScript.
 */
'use strict';

var unsupportedPseudoClasses = {
  ':active': true,
  ':checked': true,
  ':default': true,
  ':dir': true,
  ':disabled': true,
  ':empty': true,
  ':enabled': true,
  ':first': true,
  ':first-child': true,
  ':first-of-type': true,
  ':fullscreen': true,
  ':focus': true,
  ':hover': true,
  ':indeterminate': true,
  ':in-range': true,
  ':invalid': true,
  ':lang': true,
  ':last-child': true,
  ':last-of-type': true,
  ':left': true,
  ':link': true,
  ':not': true,
  ':nth-child': true,
  ':nth-last-child': true,
  ':nth-last-of-type': true,
  ':nth-of-type': true,
  ':only-child': true,
  ':only-of-type': true,
  ':optional': true,
  ':out-of-range': true,
  ':read-only': true,
  ':read-write': true,
  ':required': true,
  ':right': true,
  ':root': true,
  ':scope': true,
  ':target': true,
  ':valid': true,
  ':visited': true
};

module.exports = unsupportedPseudoClasses;
