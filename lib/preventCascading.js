'use strict';

function preventCascading(classBody) {
  for (var parameter in classBody) {
    var value = classBody[parameter];
    if (typeof value === 'object') {
      console.error('React Style does not support cascading - property ' + parameter + ' is removed');
      delete classBody[parameter];
    }
  }
}

module.exports = preventCascading;