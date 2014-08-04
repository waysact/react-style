/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
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
    var css = this.css;
    var className = css().normal;
    if (this.state.hover) {
      className += css().hover;
    }

    return <div className={className + css().normal + this.css().another} />;
  }

});

module.exports = Button;
