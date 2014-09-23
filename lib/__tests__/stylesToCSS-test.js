'use strict';

jest.dontMock('../stylesToCSS');
jest.dontMock('react/lib/hyphenate');
jest.dontMock('react/lib/hyphenateStyleName');

describe('stylesToCSS', function() {

  it('translates pseudoSelectors to CSS pseudo-classes', function() {
    var stylesToCSS = require('../stylesToCSS');
    var exampleStyle = {
      className: 'yolo',
      style: {
        display: 'block'
      },
      children: {
        onActive: {
          className: 'yolo',
          style: {
            backgroundColor: 'onActive'
          }
        },
        onHover: {
          className: 'yolo',
          style: {
            backgroundColor: 'onHover'
          }
        },
        onFocus: {
          className: 'yolo',
          style: {
            backgroundColor: 'onFocus'
          }
        },
        onChecked: {
          className: 'yolo',
          style: {
            backgroundColor: 'onChecked'
          }
        },
        onEnabled: {
          className: 'yolo',
          style: {
            backgroundColor: 'onEnabled'
          }
        },
        onDisabled: {
          className: 'yolo',
          style: {
            backgroundColor: 'onDisabled'
          }
        },
        pseudoChildren: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoChildren'
          }
        },
        pseudoLastChild: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoLastChild'
          }
        },
        pseudoFirstChild: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoFirstChild'
          }
        },
        pseudoNotLastChild: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoNotLastChild'
          }
        },
        pseudoNotFirstChild: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoNotFirstChild'
          }
        },
        pseudoFirstOfType: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoFirstOfType'
          }
        },
        pseudoLastOfType: {
          className: 'yolo',
          style: {
            backgroundColor: 'pseudoLastOfType'
          }
        }
      }
    };
    var test = stylesToCSS([exampleStyle]);

    var checkObj = {
      ':active': 'onActive',
      ':hover': 'onHover',
      ':focus': 'onFocus',
      ':checked': 'onChecked',
      ':enabled': 'onEnabled',
      ':disabled': 'onDisabled',
      ' \\> \\*': 'pseudoChildren',
      ':last-child': 'pseudoLastChild',
      ':first-child': 'pseudoFirstChild',
      ':not\\(:last-child\\)': 'pseudoNotLastChild',
      ':not\\(:first-child\\)': 'pseudoNotFirstChild',
      ':first-of-type': 'pseudoFirstOfType',
      ':last-of-type': 'pseudoLastOfType'
    };

    for (var check in checkObj) {
      var regexp = new RegExp(check + ' {[a-zA-Z;\\n\\- ]*: ' + checkObj[check] + '[a-zA-Z;\\n\\- ]*}', 'gi');
      expect(test.css.match(regexp).length).toBeGreaterThan(0);
    }
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

  it('should replicate the selector', function() {
    var stylesToCSS = require('../stylesToCSS');
    var fooStyle = {
      className: 'yolo',
      style: {
        backgroundColor: 'purple'
      }
    };
    var compiled = stylesToCSS(fooStyle);
    var replicatedSelector = compiled.css.split(' {')[0].split(',');
    var selector = '.yolo';
    for (var i = 0, l = replicatedSelector.length; i < l; i++) {
      if(i > 0) {
        selector += '.yolo' + i;
      }
      expect(selector).toEqual(replicatedSelector[i]);
    }
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
    ].join(',') + ' {',
    '  top: 0px;',
    '}',
    ''
    ].join('\n'));
  });

});
