'use strict';

jest.autoMockOff();

describe('ReactElementExtended', function() {

  it ('should style React.DOM elements when a styles property is given', function() {
    var React = require('react');

    var StyleSheet = require('../');
    var DOM = React.DOM;

    require('../ReactElementExtended');

    var tagNames = Object.keys(DOM);
    var style = {backgroundColor: 'green'};
    var styles = StyleSheet.create({foo:style});
    for (var i = 0, l = tagNames.length; i < l; i++) {
      var tagName = tagNames[i];
      expect(React.createElement(tagName, {styles: [styles.foo]}).props.style).toEqual(style);
    }
  });

  it ('should honor the reactStyleBaseOrder property', function() {
    var React = require('react');

    var ReactStyle = require('../');
    var DOM = React.DOM;

    require('../ReactElementExtended');

    var style = {backgroundColor: 'green'};
    var styles = [ReactStyle(style, 'foo', true)];

    expect(React.createElement(React.DOM.a, {styles: styles, reactStyleBaseOrder: 1}).props.className).toEqual(' foo foo1');
  });

});
