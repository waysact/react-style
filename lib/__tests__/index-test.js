jest.autoMockOff();

describe('index', function() {

  it('should warn when running inside development mode', function() {
    var _msg = '';
    var originalConsoleDebug = console.debug;
    console.debug = function(msg) {
      _msg = msg;
    };
    var ReactStyle = require('../');
    expect(_msg).toBe('You are running React Style inside development mode.');
    console.debug = originalConsoleDebug;
  });

  it('createStyle > should warn when using !important', function() {
    var called = false;
    var originalConsoleWarn = console.warn;
    var ReactStyle = require('../');
    console.warn = function(msg) {
      called = true;
    };
    var testStyle = ReactStyle.create({
      display: 'block !important'
    });
    expect(called).toBe(true);
    console.warn = originalConsoleWarn;
  });

  it('inject > should silently fail when not running inside the browser',

    function() {
      var ReactStyle = require('../');
      window.__ReactStyle__ = true;
      var failedSilently = false;
      var oldDocument = document;
      document = null;
      try {
        ReactStyle.inject();
        failedSilently = true;
      }
      catch (e) {
        // should not happen
      }
      expect(failedSilently).toBe(true);
      document = oldDocument;
    });

});