'use strict';

jest.dontMock('../stylesToCSS');
jest.dontMock('react/lib/CSSProperty');
jest.dontMock('react/lib/hyphenate');
jest.dontMock('react/lib/hyphenateStyleName');

describe('stylesToCSS', function() {

  it('should warn when trying to compile pseudo classes', function() {
    // TODO
  });
  //
  //it('compiles styles with pseudo classes', function() {
  //  var stylesToCSS = require('../stylesToCSS');
  //  var exampleStyle = {
  //    className: 'yolo',
  //    style: {
  //      display: 'block'
  //    },
  //    children: {
  //      ':active': {
  //        className: 'yolo:active',
  //        style: {
  //          backgroundColor: 'onActive'
  //        }
  //      },
  //      '::-moz-focus-inner': {
  //        className: 'yolo::-moz-focus-inner',
  //        style: {
  //          padding: 0
  //        }
  //      }
  //    }
  //  };
  //  var test = stylesToCSS([exampleStyle]);
  //  expect(test.css).toBe([
  //    [
  //    '.yolo'
  //    ].join(',') + ' {',
  //    '  display: block;',
  //    '}',
  //    [
  //    '.yolo:active'
  //    ].join(',') + ' {',
  //    '  background-color: onActive;',
  //    '}',
  //    [
  //    '.yolo::-moz-focus-inner',
  //    '.yolo.yolo1::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8::-moz-focus-inner',
  //    '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8.yolo9::-moz-focus-inner'
  //    ].join(',') + ' {',
  //    '  padding: 0px;',
  //    '}',
  //    ''
  //  ].join('\n'));
  //});

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
    expect(compiled.css).toBe([
    [
    '.yolo'
    ].join(',') + ' {',
    '  top: 0px;',
    '}',
    ''
    ].join('\n'));
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
    expect(compiled.css).toBe([
    [
    '.yolo'
    ].join(',') + ' {',
    '  color: red;',
    '}',
    ''
    ].join('\n'));
  });

});
