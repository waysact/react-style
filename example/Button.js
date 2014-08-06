/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var IntegratedStyle = require('react-style');
var vars            = require('./vars');

var Button = React.createClass({

  normalStyle: IntegratedStyle(function() {
    return {
      backgroundColor: vars.orange
    }
  }),

  activeStyle: IntegratedStyle(function() {
    if (this.state.active) {
      return {
        color: 'yellow',
        padding: '10px'
      }
    }
  }),

  getInitialState: function() {
    return {
      active: false
    };
  },

  render: function() {
    var styles = [
      this.normalStyle(),
      this.activeStyle()
    ];
    return (
      <div styles={styles} onClick={this.onClick}>
        Hello, I'm styled
      </div>
    );
  },

  onClick: function() {
    this.setState({active: !this.state.active});
  }

});

module.exports = Button;
