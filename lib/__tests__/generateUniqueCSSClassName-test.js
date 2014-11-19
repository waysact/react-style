jest.dontMock('../generateUniqueCSSClassName');

describe('generateUniqueCSSClassName', function() {

  it('should generate unique classNames based on fileName + className',
    function() {
    var generateUniqueCSSClassName = require('../generateUniqueCSSClassName');
    var uniqueClassName1 = generateUniqueCSSClassName('a', 'b');
    var uniqueClassName2 = generateUniqueCSSClassName('a', 'b');
    var uniqueClassName3 = generateUniqueCSSClassName('a', 'c');
    expect(uniqueClassName1).toBe(uniqueClassName2);
    expect(uniqueClassName2).not.toBe(uniqueClassName3);
  });

  it ('should support up to 26^3 unique classNames', function() {
    var generateUniqueCSSClassName = require('../generateUniqueCSSClassName');
    var uniqueClassNames = {};
    for (var i = 0, l = 26 * 26 * 26; i < l; i++) {
      var uniqueClassName = generateUniqueCSSClassName('a_' + i, 'test_' + i);
      expect(uniqueClassNames[uniqueClassName]).toBe(undefined);
      uniqueClassNames[uniqueClassName] = true;
    }
  });

});