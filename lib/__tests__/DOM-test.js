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

  it('should concat styles on transferPropsTo', function() {
    var React = require('react');
    var ReactTestUtils = require('react/lib/ReactTestUtils');
    var Style = require('../Style');
    var DOM = require('../DOM');

    var baseStyles = new Style({color: 'red'}, null, false);
    var extraStyles = new Style({color: 'black'}, null, false);

    var Component = React.createClass({
      render: function() {
        var component = this.transferPropsTo(
          DOM.div({styles: baseStyles, ref: 'underlying'})
        );
        expect(component.props.styles).toEqual([baseStyles, extraStyles]);
        return component;
      }
    });

    var component = Component({styles: extraStyles});
    component = ReactTestUtils.renderIntoDocument(component);
  });

  it('should concat styles on cloneWithProps', function() {
    var React = require('react');
    var cloneWithProps = require('react/lib/cloneWithProps');
    var Style = require('../Style');
    var DOM = require('../DOM');

    var baseStyles = new Style({color: 'red'}, null, false);
    var extraStyles = new Style({color: 'black'}, null, false);

    var component = DOM.div({styles: baseStyles});
    component = cloneWithProps(component, {styles: extraStyles});

    expect(component.props.styles).toEqual([extraStyles, baseStyles]);
  });

});
