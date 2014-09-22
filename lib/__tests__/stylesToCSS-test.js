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

  it('should support compiling non-arrays', function() {

  });

});