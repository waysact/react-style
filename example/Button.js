/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var classSet = React.addons.classSet;
var vars  = require('./vars');

var Button = React.createClass({

  css: function(){
    return {
      normal: {
        backgroundColor: vars.orange
      },
      hover: {
        backgroundColor: 'blue'
      },
      another: {
        fontWeight: 'bold'
      },
      'another:hover': {
        fontStyle: 'italic'
      }
    };
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var className = classSet(
      this.css().normal,
      this.state.hover ? this.css().hover : null
    );
    return <div className={className} />;
  }

});

module.exports = Button;
