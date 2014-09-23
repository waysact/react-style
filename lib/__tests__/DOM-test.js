'use strict';

jest.autoMockOff();

describe('DOM', function() {

  it ('should augment React.DOM elements with a styles property', function() {
    var DOM = require('../DOM');
    var tagNames = Object.keys(DOM);
    var styles = [{backgroundColor: 'green'}];
    for (var i = 0, l = tagNames.length; i < l; i++) {
      var tagName = tagNames[i];
      expect(DOM[tagName]({styles:styles}).props.styles).toEqual(styles);
    }
  });

  it ('should preserve the displayName', function() {
    var DOM = require('../DOM');
    var tagNames = Object.keys(DOM);
    for (var i = 0, l = tagNames.length; i < l; i++) {
      var tagName = tagNames[i];
      expect(DOM[tagName].displayName).toEqual(tagName);
    }
  });

  it ('should apply styles when updating a component', function() {
    // TODO
  });

});