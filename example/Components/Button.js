/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var Button = React.createClass({

  css: {
    normal: {
      backgroundColor: 'orange'
    },
    hover: {
      backgroundColor: 'blue'
    },
    another: {
      fontWeight: 'bold'
    }
  },

  getInitialState: function() {
    return {
      hover: false
    };
  },

  render: function() {
    var css = this.css;
    var className = css.normal;
    if (this.state.hover) {
      className += css.hover;
    }
    return React.DOM.div({className: className + css.normal + this.css.another});
  }

});

module.exports = Button;
