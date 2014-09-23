
jest.dontMock('../applyStyles');

function fakeStyle(className, style, isCompiled) {
  return {
    className: className,
    style: style,
    isCompiled: function() { return isCompiled; }
  };
}

describe('applyStyles', function() {

  it('applies compiled styles', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, true));
    expect(props.className).toBe(' c1');
    expect(props.style).toBeUndefined();
  });

  it('applies uncompiled styles', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
    expect(props.className).toBeUndefined();
    expect(props.style).toBeDefined();
    expect(props.style.color).toBe('red');
  });

  it('applies compiled styles as uncompiled if it cannot guarantee precedence', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1_', {color: '1'}, true),
      fakeStyle('c2_', {color: '2'}, true),
      fakeStyle('c3_', {color: '3'}, true),
      fakeStyle('c4_', {color: '4'}, true),
      fakeStyle('c5_', {color: '5'}, true),
      fakeStyle('c6_', {color: '6'}, true),
      fakeStyle('c7_', {color: '7'}, true),
      fakeStyle('c8_', {color: '8'}, true),
      fakeStyle('c9_', {color: '9'}, true),
      fakeStyle('c10_', {color: '10'}, true),
      fakeStyle('inline', {color: 'inline'}, true)
      ]);
    expect(props.className).toBe(' c1_ c2_ c2_1 c3_ c3_1 c3_2 c4_ c4_1 c4_2 c4_3 c5_ c5_1 c5_2 c5_3 c5_4 c6_ c6_1 c6_2 c6_3 c6_4 c6_5 c7_ c7_1 c7_2 c7_3 c7_4 c7_5 c7_6 c8_ c8_1 c8_2 c8_3 c8_4 c8_5 c8_6 c8_7 c9_ c9_1 c9_2 c9_3 c9_4 c9_5 c9_6 c9_7 c9_8 c10_ c10_1 c10_2 c10_3 c10_4 c10_5 c10_6 c10_7 c10_8 c10_9')
    expect(props.style).toBeDefined();
    expect(props.style.color).toBe('inline');
  });

  it('overrides one compiled style with another', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1', {color: 'red'}, true),
      fakeStyle('c2', {color: 'blue'}, true)
    ]);
    expect(props.className).toBe(' c1 c2 c21');
    expect(props.style).toBeUndefined();
  });

  it('overrides one uncompiled style with another', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1', {color: 'red'}, false),
      fakeStyle('c2', {color: 'blue'}, false)
    ]);
    expect(props.className).toBeUndefined();
    expect(props.style).toBeDefined();
    expect(props.style.color).toBe('blue');
  });

  it('overrides compiled style with uncompiled', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1', {color: 'red'}, true),
      fakeStyle('c2', {color: 'blue'}, false)
    ]);
    expect(props.className).toBe(' c1');
    expect(props.style).toBeDefined();
    expect(props.style.color).toBe('blue');
  });

  it('overrides uncompiled style with compiled', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1', {color: 'red'}, false),
      fakeStyle('c2', {color: 'blue'}, true)
    ]);
    expect(props.className).toBe(' c2');
    expect(props.style).toBeDefined();
    expect(props.style.color).toBe(null);
  });

  it('flattens nested arrays when applying styles', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      [fakeStyle('c1', {color: 'red'}, true)],
      [[fakeStyle('c2', {color: 'blue'}, true)]]
    ]);
    expect(props.className).toBe(' c1 c2 c21');
    expect(props.style).toBeUndefined();
  });

  it('overrides "style" prop with uncompiled style', function() {
    var applyStyles = require('../applyStyles');
    var props = {style: {color: 'black'}};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
    expect(props.style.color).toBe('red');
  });

  it('overrides "style" prop with compiled style', function() {
    var applyStyles = require('../applyStyles');
    var props = {style: {color: 'black'}};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, true));
    expect(props.className).toBe(' c1');
    expect(props.style.color).toBe(null);
  });

  it('preserves className while applying uncompiled style', function() {
    var applyStyles = require('../applyStyles');
    var props = {className: 'x'};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
    expect(props.className).toBe('x');
    expect(props.style.color).toBe('red');
  });

  it('preserves className while applying compiled style', function() {
    var applyStyles = require('../applyStyles');
    var props = {className: 'x'};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, true));
    expect(props.className).toBe('x c1');
  });

});
