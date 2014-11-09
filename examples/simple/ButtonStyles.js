'use strict';

var ReactStyle = require('react-style');

var ButtonStyles = {
  primary: ReactStyle({
    backgroundColor: 'rgb(0, 120, 231)',
    color: '#fff'
  }, 'Button_primary'),

  success: ReactStyle({
    color: 'white',
    background: 'rgb(28, 184, 65)'
  }, 'Button_success'),

  error: ReactStyle({
    color: 'white',
    background: 'rgb(202, 60, 60)'
  }, 'Button_error')
};

module.exports = ButtonStyles;
