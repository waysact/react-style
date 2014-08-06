/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var ReactStyle = require('react-style');
var vars       = require('./vars');

var Button = React.createClass({

  normalStyle: ReactStyle(function() {
    return {
      backgroundColor: vars.orange
    }
  }),

  activeStyle: ReactStyle(function() {
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
