/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var classSet        = React.addons.classSet;
var vars            = require('./vars');
var IntegratedStyle = require('../');

var Button = React.createClass({

  normalStyle: IntegratedStyle(function() {
    return {
      backgroundColor: vars.orange
    }
  }),

  hoverStyle: IntegratedStyle(function() {
    return {
      backgroundColor: 'blue'
    }
  }),

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var style = [this.normalStyle(), this.state.hover && this.hoverStyle()];
    return <div style={style} />;
  }

});

module.exports = Button;
