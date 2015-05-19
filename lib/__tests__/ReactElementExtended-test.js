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

  it ('should auto-prefix styles', function() {
    var React = require('react');

    var StyleSheet = require('../');
    var DOM = React.DOM;

    require('../ReactElementExtended');

    StyleSheet.setAutoprefixData({"prefix":["-webkit-","-ms-","-o-","-moz-"],"props":{"userSelect":11}});

    var style = {test: {userSelect: 'none'}};
    var styles = StyleSheet.create(style);

    var el = React.createElement(React.DOM.a, {styles: [styles.test]});
    var outputStyles = el._store.props.styles[0];
    expect("WebkitUserSelect" in outputStyles).toBe(true);
    expect("msUserSelect" in outputStyles).toBe(true);
    expect("OUserSelect" in outputStyles).toBe(false);
    expect("MozUserSelect" in outputStyles).toBe(true);
  });

  it ('should auto-prefix style values', function() {
    var React = require('react');

    var StyleSheet = require('../');
    var DOM = React.DOM;

    require('../ReactElementExtended');

    StyleSheet.setAutoprefixData({"prefix":["-webkit-","-ms-","-o-","-moz-"],"props":{"display":[0,{'flex':11}]}});

    var style = {test: {display: 'flex'}};
    var styles = StyleSheet.create(style);

    var el = React.createElement(React.DOM.a, {styles: [styles.test]});
    var outputStyles = el._store.props.styles[0];
    expect(outputStyles.display).toBe("flex -webkit-flex -ms-flex -moz-flex");
  });
});
