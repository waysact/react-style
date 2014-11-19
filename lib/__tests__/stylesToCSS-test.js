'use strict';

jest.dontMock('react/lib/CSSProperty');
jest.dontMock('react/lib/hyphenate');
jest.dontMock('react/lib/hyphenateStyleName');
jest.dontMock('../stylesToCSS');
jest.dontMock('../unsupportedPseudoClasses');

describe('stylesToCSS', function() {

  it('should ignore pseudo classes', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'foo',
      style: {
        backgroundColor: 'orange',
        ':not(something': {
          color: 'green'
        },
        ':hover': {
          color: 'orange'
        }
      }
    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css.indexOf(':not(')).toBe(-1);
    expect(compiled.css.indexOf(':hover')).toBe(-1);
  });

  it('should warn when using pseudo classes', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'foo',
      style: {
        backgroundColor: 'orange',
        ':hover': {
          color: 'green'
        }
      }
    };
    var _msg = '';
    var originalConsoleWarn = console.warn;
    console.warn = function(msg) {
      _msg = msg;
    };
    stylesToCSS(fooStyle);
    expect(_msg).toBe('You are using unsupported ' +
      'pseudo-class :hover. We don\'t ' +
      'support this pseudo-class due to the influence ' +
      'it has on CSS precedence and therefore breaks ' +
      'out of the React Style require-tree model. ' +
      'You should solve this using a JavaScript-based ' +
      'equivalent. More details: [url]');
    console.warn = originalConsoleWarn;
  });

  it('should hyphenate CSS properties', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'foo',
      style: {
        backgroundColor: 'green'
      }
    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css.indexOf('background-color: green')).toBeGreaterThan(0);
  });

  it('should not add style without a className', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {

    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css).toEqual('');
  });

  it('should not add a style if it\'s already present', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'yolo',
      style: {
        backgroundColor: 'orange'
      }
    };
    var fooStyle2 = {
      className: 'yolo',
      style: {
        backgroundColor: 'orange'
      }
    };

    var oneStyle = stylesToCSS(fooStyle);
    var doubleStyle = stylesToCSS([fooStyle, fooStyle2]);

    expect(oneStyle).toEqual(doubleStyle);
  });

  it('compiles numbers into px literals', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'yolo',
      style: {
        top: 0
      }
    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css).toBe(
    '.yolo {\n' +
    '  top: 0px;\n' +
    '}\n');

  });

  it('should not add px to unitless numbers', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'foo',
      style: {
        zIndex: 4
      }
    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css.indexOf('z-index: 4;')).toBeGreaterThan(0);
  });

  it('compiles styles', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'yolo',
      style: {
        color: 'red'
      }
    };
    var compiled = stylesToCSS(fooStyle);
    expect(compiled.css).toBe(
    '.yolo {\n' +
    '  color: red;\n' +
    '}\n');
  });

});
