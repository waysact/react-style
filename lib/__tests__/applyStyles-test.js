
jest.dontMock('../applyStyles');

function fakeStyle(className, style, isCompiled) {
  return {
    className: className,
    style: style,
    isCompiled: function() { return isCompiled; }
  };
}

describe('applyStyles', function() {

  it('applies uncompiled styles', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
    expect(props.style.className).toBe('c1');
    expect(props.style.style.color).toBe('red');
  });

  it('overrides one uncompiled style with another', function() {
    var applyStyles = require('../applyStyles');
    var props = {};
    applyStyles(props, [
      fakeStyle('c1', {color: 'red'}, false),
      fakeStyle('c2', {color: 'blue'}, false)
    ]);
    expect(props.style.className).toBe('c2');
    expect(props.style.style.color).toBe('blue');
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
  //
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
  //
  //it('flattens nested arrays when applying styles', function() {
  //  var applyStyles = require('../applyStyles');
  //  var props = {};
  //  applyStyles(props, [
  //    [fakeStyle('c1', {color: 'red'}, true)],
  //    [[fakeStyle('c2', {color: 'blue'}, true)]]
  //  ]);
  //  expect(props.className).toBe(' c1 c2 c21');
  //  expect(props.style).toBeUndefined();
  //});
  //
  //it('overrides "style" prop with uncompiled style', function() {
  //  var applyStyles = require('../applyStyles');
  //  var props = {style: {color: 'black'}};
  //  applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
  //  expect(props.style.color).toBe('red');
  //});
  //
  //it('overrides "style" prop with compiled style', function() {
  //  var applyStyles = require('../applyStyles');
  //  var props = {style: {color: 'black'}};
  //  applyStyles(props, fakeStyle('c1', {color: 'red'}, true));
  //  expect(props.className).toBe(' c1');
  //  expect(props.style.color).toBe(null);
  //});
  //
  //it('preserves className while applying uncompiled style', function() {
  //  var applyStyles = require('../applyStyles');
  //  var props = {className: 'x'};
  //  applyStyles(props, fakeStyle('c1', {color: 'red'}, false));
  //  expect(props.className).toBe('x');
  //  expect(props.style.color).toBe('red');
  //});
  //
  //it('preserves className while applying compiled style', function() {
  //  var applyStyles = require('../applyStyles');
  //  var props = {className: 'x'};
  //  applyStyles(props, fakeStyle('c1', {color: 'red'}, true));
  //  expect(props.className).toBe('x c1');
  //});

});
