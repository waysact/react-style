'use strict';

jest.autoMockOff();

describe('stylesToCSS', function() {

  it('should ignore pseudo classes', function() {
    var css;
    runs(function() {
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
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css.indexOf(':not(')).toBe(-1);
      expect(css.indexOf(':hover')).toBe(-1);
    });
  });

  it('should warn when using pseudo classes', function() {
    var _msg;
    var originalConsoleWarn = console.warn;
    runs(function() {
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
      console.warn = function(msg) {
        _msg = msg;
      };
      stylesToCSS(fooStyle, 10, null, function() {});
    });
    waitsFor(function() {
      return _msg !== undefined;
    });
    runs(function() {
      expect(_msg).toBe('You are trying to use pseudo class :hover, which we ' +
                        'don\'t support as this is better implemented using ' +
                        'JavaScript.');
      console.warn = originalConsoleWarn;
    });
  });

  it('should not add style without a className', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {

      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css).toEqual('');
    });
  });

  it('should not add a style if it\'s already present', function() {
    var oneStyle, doubleStyle;
    runs(function() {
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

      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        oneStyle = compiled;
      });
      stylesToCSS([fooStyle, fooStyle2], 10, null, function(error, compiled) {
        doubleStyle = compiled;
      });
    });
    waitsFor(function() {
      return oneStyle !== undefined && doubleStyle !== undefined;
    });
    runs(function() {
      expect(oneStyle.css).toEqual(doubleStyle.css);
    });
  });

  it('should replicate the selector', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'yolo',
        style: {
          backgroundColor: 'purple'
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      var replicatedSelector = css.split('{')[0].split(',');
      var selector = '.yolo';
      for (var i = 0, l = replicatedSelector.length; i < l; i++) {
        if(i > 0) {
          selector += '.yolo' + i;
        }
        expect(selector).toEqual(replicatedSelector[i]);
      }
    });
  });

  it('compiles numbers into px literals', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'yolo',
        style: {
          top: 0
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css).toBe([
        '.yolo',
        '.yolo.yolo1',
        '.yolo.yolo1.yolo2',
        '.yolo.yolo1.yolo2.yolo3',
        '.yolo.yolo1.yolo2.yolo3.yolo4',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8.yolo9'
      ].join(',') + '{top:0px;}\n');
    });
  });

  it('should not add px to unitless numbers', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'foo',
        style: {
          zIndex: 4
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css.indexOf('z-index:4;')).toBeGreaterThan(0);
    });
  });

  it('compiles styles', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'yolo',
        style: {
          color: 'red'
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css).toBe([
        '.yolo',
        '.yolo.yolo1',
        '.yolo.yolo1.yolo2',
        '.yolo.yolo1.yolo2.yolo3',
        '.yolo.yolo1.yolo2.yolo3.yolo4',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8.yolo9'
      ].join(',') + '{color:red;}\n');
    });
  });

  it('replicates with the duplicate style key', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'yolo',
        style: {
          color: ['red', 'white']
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css).toBe([
        '.yolo',
        '.yolo.yolo1',
        '.yolo.yolo1.yolo2',
        '.yolo.yolo1.yolo2.yolo3',
        '.yolo.yolo1.yolo2.yolo3.yolo4',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8',
        '.yolo.yolo1.yolo2.yolo3.yolo4.yolo5.yolo6.yolo7.yolo8.yolo9'
      ].join(',') + '{color:red;color:white;}\n');
    });
  });

  it('should quote content value', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'foo',
        style: {
          content: "hello"
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css.indexOf('content:\'hello\';')).toBeGreaterThan(0);
    });
  });

  it('should escape quoted content value', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'foo',
        style: {
          content: "''"
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css.indexOf('content:\'\\\'\\\'\';')).toBeGreaterThan(0);
    });
  });

  it('should not quote valid content values', function() {
    var css;
    runs(function() {
      var stylesToCSS = require('../stylesToCSS');
      var fooStyle = {
        className: 'foo',
        style: {
          content: 'url(boo) attr(data-foo) open-quote'
        }
      };
      stylesToCSS(fooStyle, 10, null, function(error, compiled) {
        css = compiled.css;
      });
    });
    waitsFor(function() {
      return css !== undefined;
    });
    runs(function() {
      expect(css.indexOf('content:url(boo) attr(data-foo) open-quote;')).toBeGreaterThan(0);
    });
  });
});
