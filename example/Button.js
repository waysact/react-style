/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var classSet = React.addons.classSet;
var vars  = require('./vars');

var Button = React.createClass({

  normalStyle: function() {
    return {
      backgroundColor: vars.orange
    }
  },

  hoverStyle: function() {
    return {
      backgroundColor: 'blue'
    }
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var className = classSet(
      this.normalStyle(),
      this.state.hover ? this.hoverStyle() : null
    );
    return <div className={className} />;
  }

});

module.exports = Button;
